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
  const formattedStaff = staff.map((s) => {
    let avgRating = 0;
    if (s.staffProfile?.ratings && s.staffProfile.ratings.length > 0) {
      const sum = s.staffProfile.ratings.reduce((acc, r) => acc + r.score, 0);
      avgRating = sum / s.staffProfile.ratings.length;
    }
    return {
      ...s,
      averageRating: avgRating,
    };
  });

  return {
    data: formattedStaff,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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
  return staff;
};

export const createStaff = async (data: any) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });

  if (existingUser) {
    throw new Error('Email or username already in use');
  }

  const hashedPassword = await hashPassword(data.password);

  const newStaff = await prisma.user.create({
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
        },
      },
    },
    include: { staffProfile: true },
  });

  const { password, ...staffWithoutPassword } = newStaff;
  return staffWithoutPassword;
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
  if (data.bio) profileUpdateData.bio = data.bio;
  if (data.position) profileUpdateData.position = data.position;
  if (data.isActive !== undefined) profileUpdateData.isActive = data.isActive;

  const updatedStaff = await prisma.user.update({
    where: { id },
    data: {
      ...updateData,
      staffProfile: {
        update: profileUpdateData,
      },
    },
    select: { id: true, firstName: true, lastName: true, isActive: true, staffProfile: true },
  });

  return updatedStaff;
};
