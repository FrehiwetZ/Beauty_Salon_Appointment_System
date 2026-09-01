import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { Role } from '@prisma/client';

export const getAllStaff = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;

  const whereClause: any = {
    role: Role.STAFF,
  };

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [staff, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        staffProfile: {
          include: {
            services: { include: { service: true } },
            workingHours: true,
            ratings: { select: { score: true } },
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  // Calculate average rating
  const formattedStaff = (Array.isArray(staff) ? staff : []).map((s) => {
    let avgRating = 0;
    const ratings = Array.isArray(s.staffProfile?.ratings) ? s.staffProfile.ratings : [];
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.score, 0);
      avgRating = sum / ratings.length;
    }
    return {
      ...s,
      imageUrl: (s.staffProfile as any)?.imageUrl || null,
      image: (s.staffProfile as any)?.imageUrl || null,
      averageRating: avgRating,
    };
  });

  return {
    data: formattedStaff,
    pagination: {
      page,
      limit,
      total: total || 0,
      totalPages: Math.ceil((total || 0) / limit),
    },
  };
};

export const getStaffById = async (id: string) => {
  const staff = await prisma.user.findFirst({
    where: { id, role: Role.STAFF },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      staffProfile: {
        include: {
          services: { include: { service: true } },
          workingHours: true,
          ratings: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
      },
    },
  });

  if (!staff) throw new Error('Staff not found');
  return {
    ...staff,
    imageUrl: (staff.staffProfile as any)?.imageUrl || null,
    image: (staff.staffProfile as any)?.imageUrl || null,
  };
};

export const createStaff = async (data: any) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });

  if (existingUser) {
    throw new Error('Email or username already in use');
  }

  const hashedPassword = await hashPassword(data.password);
  const serviceIds: string[] = Array.isArray(data.serviceIds) ? data.serviceIds : [];

  const newStaff = await prisma.$transaction(async (tx) => {
    return tx.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: Role.STAFF,
        staffProfile: {
          create: {
            bio: data.bio,
            position: data.position,
            imageUrl: data.imageUrl || null,
            services: {
              create: serviceIds.map((serviceId: string) => ({
                serviceId,
              })),
            },
            // Auto-create default working hours: Mon-Fri 09:00-17:00, Sat-Sun off
            workingHours: {
              create: [
                { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isDayOff: true },  // Sunday
                { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isDayOff: false }, // Monday
                { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isDayOff: false }, // Tuesday
                { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isDayOff: false }, // Wednesday
                { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isDayOff: false }, // Thursday
                { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isDayOff: false }, // Friday
                { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isDayOff: true },  // Saturday
              ],
            },
          },
        },
      },
      include: {
        staffProfile: {
          include: {
            services: { include: { service: true } },
            workingHours: true,
            ratings: { select: { score: true } },
          },
        },
      },
    });
  });

  const { password, ...staffWithoutPassword } = newStaff;
  return {
    ...staffWithoutPassword,
    imageUrl: (staffWithoutPassword.staffProfile as any)?.imageUrl || null,
    image: (staffWithoutPassword.staffProfile as any)?.imageUrl || null,
    averageRating: 0,
  };
};

export const updateStaff = async (id: string, requesterId: string, requesterRole: string, data: any) => {
  const user = await prisma.user.findFirst({ where: { id, role: Role.STAFF }, include: { staffProfile: true } });
  if (!user) throw new Error('Staff not found');

  if (requesterRole !== Role.ADMIN && user.id !== requesterId) {
    throw new Error('Unauthorized');
  }

  const updateData: any = {};
  if (data.firstName) updateData.firstName = data.firstName;
  if (data.lastName) updateData.lastName = data.lastName;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const profileUpdateData: any = {};
  if (data.bio !== undefined) profileUpdateData.bio = data.bio;
  if (data.position !== undefined) profileUpdateData.position = data.position;
  if (data.imageUrl !== undefined) profileUpdateData.imageUrl = data.imageUrl;
  if (data.isActive !== undefined) profileUpdateData.isActive = data.isActive;

  const updatedStaff = await prisma.user.update({
    where: { id },
    data: {
      ...updateData,
      staffProfile: {
        update: profileUpdateData,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      staffProfile: {
        include: {
          services: { include: { service: true } },
          workingHours: true,
          ratings: { select: { score: true } },
        },
      },
    },
  });

  return {
    ...updatedStaff,
    imageUrl: (updatedStaff.staffProfile as any)?.imageUrl || null,
    image: (updatedStaff.staffProfile as any)?.imageUrl || null,
  };
};

export const assignServices = async (staffUserId: string, serviceIds: string[]) => {
  const user = await prisma.user.findUnique({
    where: { id: staffUserId },
    include: { staffProfile: true },
  });
  if (!user || !user.staffProfile) throw new Error('Staff not found');
  const staffId = user.staffProfile.id;
  const safeServiceIds = Array.isArray(serviceIds) ? serviceIds : [];

  return prisma.$transaction(async (tx) => {
    // Clear existing assignments first to support update
    await tx.staffService.deleteMany({
      where: { staffId },
    });

    // Bulk insert new assignments
    if (safeServiceIds.length > 0) {
      await tx.staffService.createMany({
        data: safeServiceIds.map((serviceId) => ({
          staffId,
          serviceId,
        })),
      });
    }

    return tx.staffProfile.findUnique({
      where: { id: staffId },
      include: { services: { include: { service: true } } },
    });
  });
};

export const removeService = async (staffUserId: string, serviceId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: staffUserId },
    include: { staffProfile: true },
  });
  if (!user || !user.staffProfile) throw new Error('Staff not found');
  const staffId = user.staffProfile.id;

  return prisma.staffService.delete({
    where: {
      staffId_serviceId: {
        staffId,
        serviceId,
      },
    },
  });
};

export const createBlockedPeriod = async (staffUserId: string, data: any) => {
  const user = await prisma.user.findUnique({
    where: { id: staffUserId },
    include: { staffProfile: true },
  });
  if (!user || !user.staffProfile) throw new Error('Staff not found');
  const staffId = user.staffProfile.id;

  return prisma.blockedPeriod.create({
    data: {
      staffId,
      date: data.date,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      reason: data.reason || null,
    },
  });
};

export const getBlockedPeriods = async (staffUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: staffUserId },
    include: { staffProfile: true },
  });
  if (!user || !user.staffProfile) throw new Error('Staff not found');
  const staffId = user.staffProfile.id;

  const blocked = await prisma.blockedPeriod.findMany({
    where: { staffId },
    orderBy: { date: 'asc' },
  });
  return blocked || [];
};

export const deleteBlockedPeriod = async (blockedPeriodId: string) => {
  return prisma.blockedPeriod.delete({
    where: { id: blockedPeriodId },
  });
};

export const updateWorkingHours = async (staffUserId: string, workingHours: any[]) => {
  const user = await prisma.user.findUnique({
    where: { id: staffUserId },
    include: { staffProfile: true },
  });
  if (!user || !user.staffProfile) throw new Error('Staff not found');
  const staffId = user.staffProfile.id;
  const safeWorkingHours = Array.isArray(workingHours) ? workingHours : [];

  // Use a transaction to upsert working hours
  return prisma.$transaction(
    safeWorkingHours.map((wh) =>
      prisma.workingHour.upsert({
        where: {
          staffId_dayOfWeek: {
            staffId,
            dayOfWeek: wh.dayOfWeek,
          },
        },
        update: {
          startTime: wh.startTime,
          endTime: wh.endTime,
          isDayOff: wh.isDayOff ?? false,
        },
        create: {
          staffId,
          dayOfWeek: wh.dayOfWeek,
          startTime: wh.startTime,
          endTime: wh.endTime,
          isDayOff: wh.isDayOff ?? false,
        },
      })
    )
  );
};

export const getWorkingHours = async (staffUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: staffUserId },
    include: { staffProfile: true },
  });
  if (!user || !user.staffProfile) throw new Error('Staff not found');
  const staffId = user.staffProfile.id;

  const hours = await prisma.workingHour.findMany({
    where: { staffId },
    orderBy: { dayOfWeek: 'asc' },
  });
  return hours || [];
};
