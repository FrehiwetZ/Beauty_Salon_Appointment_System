import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { Role } from '@prisma/client';

/**
 * Get all staff
 */
export const getAllStaff = async (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 10);
  const skip = (safePage - 1) * safeLimit;

  const whereClause: any = {
    role: Role.STAFF,
    staffProfile: {
      isDeleted: false,
    },
  };

  if (search && search.trim()) {
    const searchValue = search.trim();

    whereClause.AND = [
      {
        OR: [
          {
            firstName: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ],
      },
    ];
  }

  // Auto-reactivate staff whose deactivatedUntil has passed
  await prisma.staffProfile.updateMany({
    where: {
      isActive: false,
      isDeleted: false,
      deactivatedUntil: {
        lte: new Date(),
        not: null,
      },
    },
    data: {
      isActive: true,
      deactivationReason: null,
      deactivatedUntil: null,
    },
  });

  const [staff, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,

        staffProfile: {
          include: {
            services: {
              include: {
                service: true,
              },
            },

            workingHours: true,

            ratings: {
              select: {
                score: true,
              },
            },
          },
        },
      },

      skip,
      take: safeLimit,

      orderBy: {
        firstName: 'asc',
      },
    }),

    prisma.user.count({
      where: whereClause,
    }),
  ]);

  // Filter out soft-deleted staff for public listing
  const visibleStaff = staff.filter(
    (s) => !(s.staffProfile as any)?.isDeleted
  );

  const formattedStaff = (Array.isArray(visibleStaff) ? visibleStaff : []).map((s) => {
    const ratings = Array.isArray(s.staffProfile?.ratings)
      ? s.staffProfile.ratings
      : [];

    let averageRating = 0;

    if (ratings.length > 0) {
      const sum = ratings.reduce(
        (acc: number, rating: any) => acc + Number(rating.score || 0),
        0
      );

      averageRating = sum / ratings.length;
    }

    return {
      ...s,

      imageUrl: (s.staffProfile as any)?.imageUrl || null,
      image: (s.staffProfile as any)?.imageUrl || null,

      averageRating,
    };
  });

  return {
    data: formattedStaff,

    pagination: {
      page: safePage,
      limit: safeLimit,
      total: total || 0,
      totalPages: Math.ceil((total || 0) / safeLimit),
    },
  };
};

/**
 * Get one staff member
 */
export const getStaffById = async (id: string) => {
  const staff = await prisma.user.findFirst({
    where: {
      id,
      role: Role.STAFF,
    },

    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      isActive: true,

      staffProfile: {
        include: {
          services: {
            include: {
              service: true,
            },
          },

          workingHours: true,

          ratings: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!staff) {
    throw new Error('Staff not found');
  }

  return {
    ...staff,

    imageUrl: (staff.staffProfile as any)?.imageUrl || null,
    image: (staff.staffProfile as any)?.imageUrl || null,
  };
};

/**
 * CREATE STAFF
 *
 * Expected data:
 *
 * {
 *   email: "john@example.com",
 *   username: "john",
 *   password: "123456",
 *   firstName: "John",
 *   lastName: "Doe",
 *   bio: "...",
 *   position: "Barber",
 *   imageUrl: "...",
 *   serviceIds: ["service-id-1", "service-id-2"]
 * }
 */
export const createStaff = async (data: any) => {
  console.log('========== CREATE STAFF ==========');
  console.log('Received data:', data);

  // -----------------------------
  // Validate required fields
  // -----------------------------

  const email = String(data?.email || '').trim().toLowerCase();
  const username = String(data?.username || '').trim();
  const password = String(data?.password || '');
  const firstName = String(data?.firstName || '').trim();
  const lastName = String(data?.lastName || '').trim();

  if (!email) {
    throw new Error('Email is required');
  }

  if (!username) {
    throw new Error('Username is required');
  }

  if (!password) {
    throw new Error('Password is required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  if (!firstName) {
    throw new Error('First name is required');
  }

  if (!lastName) {
    throw new Error('Last name is required');
  }

  // -----------------------------
  // Check existing email
  // -----------------------------

  const existingEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error('Email already in use');
  }

  // -----------------------------
  // Check existing username
  // -----------------------------

  const existingUsername = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUsername) {
    throw new Error('Username already in use');
  }

  // -----------------------------
  // Prepare services
  // -----------------------------

  const serviceIds: string[] = Array.isArray(data?.serviceIds)
    ? data.serviceIds
      .filter((id: any) => typeof id === 'string')
      .map((id: string) => id.trim())
      .filter(Boolean)
    : [];

  console.log('Service IDs:', serviceIds);

  // -----------------------------
  // Make sure services exist
  // -----------------------------

  if (serviceIds.length > 0) {
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },

      select: {
        id: true,
      },
    });

    const existingServiceIds = services.map((service) => service.id);

    const invalidServiceIds = serviceIds.filter(
      (id) => !existingServiceIds.includes(id)
    );

    if (invalidServiceIds.length > 0) {
      throw new Error(
        `Invalid service ID(s): ${invalidServiceIds.join(', ')}`
      );
    }
  }

  // -----------------------------
  // Hash password
  // -----------------------------

  const hashedPassword = await hashPassword(password);

  // -----------------------------
  // -----------------------------
  // Create staff (atomic writes only)
  // -----------------------------

  const createdUserId = await prisma.$transaction(
    async (tx) => {
      console.log('Creating user...');

      // 1. Create USER
      const createdUser = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          role: Role.STAFF,
          isActive:
            typeof data?.isActive === 'boolean'
              ? data.isActive
              : true,
        },
      });

      console.log('User created:', createdUser.id);

      // 2. Create STAFF PROFILE
      const staffProfile = await tx.staffProfile.create({
        data: {
          userId: createdUser.id,

          bio:
            data?.bio !== undefined
              ? String(data.bio)
              : null,
          bioAm:
            data?.bioAm !== undefined
              ? String(data.bioAm)
              : null,
          bioOm:
            data?.bioOm !== undefined
              ? String(data.bioOm)
              : null,

          position:
            data?.position !== undefined
              ? String(data.position)
              : null,
          positionAm:
            data?.positionAm !== undefined
              ? String(data.positionAm)
              : null,
          positionOm:
            data?.positionOm !== undefined
              ? String(data.positionOm)
              : null,

          imageUrl:
            data?.imageUrl
              ? String(data.imageUrl)
              : null,
        } as any,
      });

      console.log('Staff profile created:', staffProfile.id);

      // 3. Assign services
      if (serviceIds.length > 0) {
        await tx.staffService.createMany({
          data: serviceIds.map((serviceId) => ({
            staffId: staffProfile.id,
            serviceId,
          })),
          skipDuplicates: true,
        });

        console.log('Services assigned');
      }

      // 4. Create working hours
      await tx.workingHour.createMany({
        data: [
          {
            staffId: staffProfile.id,
            dayOfWeek: 0,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: true,
          },
          {
            staffId: staffProfile.id,
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: false,
          },
          {
            staffId: staffProfile.id,
            dayOfWeek: 2,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: false,
          },
          {
            staffId: staffProfile.id,
            dayOfWeek: 3,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: false,
          },
          {
            staffId: staffProfile.id,
            dayOfWeek: 4,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: false,
          },
          {
            staffId: staffProfile.id,
            dayOfWeek: 5,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: false,
          },
          {
            staffId: staffProfile.id,
            dayOfWeek: 6,
            startTime: '09:00',
            endTime: '17:00',
            isDayOff: true,
          },
        ],
      });

      console.log('Working hours created');

      return createdUser.id;
    },
    {
      maxWait: 5000,
      timeout: 15000,
    }
  );

  // -----------------------------
  // 5. Fetch complete staff outside transaction
  // -----------------------------
  const newStaff = await prisma.user.findUnique({
    where: {
      id: createdUserId,
    },

    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      isActive: true,

      staffProfile: {
        include: {
          services: {
            include: {
              service: true,
            },
          },

          workingHours: true,

          ratings: {
            select: {
              score: true,
            },
          },
        },
      },
    },
  });

  if (!newStaff) {
    throw new Error('Failed to create staff');
  }

  const ratings = Array.isArray(newStaff.staffProfile?.ratings)
    ? newStaff.staffProfile.ratings
    : [];

  let averageRating = 0;

  if (ratings.length > 0) {
    const sum = ratings.reduce(
      (acc: number, rating: any) =>
        acc + Number(rating.score || 0),
      0
    );

    averageRating = sum / ratings.length;
  }

  const result = {
    ...newStaff,

    imageUrl:
      (newStaff.staffProfile as any)?.imageUrl || null,

    image:
      (newStaff.staffProfile as any)?.imageUrl || null,

    averageRating,
  };

  console.log('STAFF CREATED SUCCESSFULLY:', result.id);
  console.log('================================');

  return result;
};

/**
 * UPDATE STAFF
 */
export const updateStaff = async (
  id: string,
  requesterId: string,
  requesterRole: string,
  data: any
) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: Role.STAFF,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user) {
    throw new Error('Staff not found');
  }

  if (
    requesterRole !== Role.ADMIN &&
    user.id !== requesterId
  ) {
    throw new Error('Unauthorized');
  }

  const updateData: any = {};

  if (data.firstName !== undefined) {
    updateData.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    updateData.lastName = data.lastName;
  }

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.username !== undefined) {
    updateData.username = data.username;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const profileUpdateData: any = {};

  if (data.bio !== undefined) {
    profileUpdateData.bio = data.bio;
  }
  if (data.bioAm !== undefined) {
    profileUpdateData.bioAm = data.bioAm;
  }
  if (data.bioOm !== undefined) {
    profileUpdateData.bioOm = data.bioOm;
  }

  if (data.position !== undefined) {
    profileUpdateData.position = data.position;
  }
  if (data.positionAm !== undefined) {
    profileUpdateData.positionAm = data.positionAm;
  }
  if (data.positionOm !== undefined) {
    profileUpdateData.positionOm = data.positionOm;
  }

  if (data.imageUrl !== undefined) {
    profileUpdateData.imageUrl = data.imageUrl;
  }

  const updatedStaff = await prisma.user.update({
    where: {
      id,
    },

    data: {
      ...updateData,

      staffProfile: {
        update: profileUpdateData,
      },
    },

    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      isActive: true,

      staffProfile: {
        include: {
          services: {
            include: {
              service: true,
            },
          },

          workingHours: true,

          ratings: {
            select: {
              score: true,
            },
          },
        },
      },
    },
  });

  return {
    ...updatedStaff,

    imageUrl:
      (updatedStaff.staffProfile as any)?.imageUrl || null,

    image:
      (updatedStaff.staffProfile as any)?.imageUrl || null,
  };
};

/**
 * Assign services to staff
 */
export const assignServices = async (
  staffUserId: string,
  serviceIds: string[]
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: staffUserId,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  const staffId = user.staffProfile.id;

  const safeServiceIds = Array.isArray(serviceIds)
    ? serviceIds
    : [];

  return prisma.$transaction(async (tx) => {
    await tx.staffService.deleteMany({
      where: {
        staffId,
      },
    });

    if (safeServiceIds.length > 0) {
      await tx.staffService.createMany({
        data: safeServiceIds.map((serviceId) => ({
          staffId,
          serviceId,
        })),

        skipDuplicates: true,
      });
    }

    return tx.staffProfile.findUnique({
      where: {
        id: staffId,
      },

      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }, { timeout: 15000 });
};

/**
 * Remove service from staff
 */
export const removeService = async (
  staffUserId: string,
  serviceId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: staffUserId,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

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

/**
 * Create blocked period
 */
export const createBlockedPeriod = async (
  staffUserId: string,
  data: any
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: staffUserId,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

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

/**
 * Get blocked periods
 */
export const getBlockedPeriods = async (
  staffUserId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: staffUserId,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  const staffId = user.staffProfile.id;

  const blocked = await prisma.blockedPeriod.findMany({
    where: {
      staffId,
    },

    orderBy: {
      date: 'asc',
    },
  });

  return blocked || [];
};

/**
 * Delete blocked period
 */
export const deleteBlockedPeriod = async (
  blockedPeriodId: string
) => {
  return prisma.blockedPeriod.delete({
    where: {
      id: blockedPeriodId,
    },
  });
};

/**
 * Update working hours
 */
export const updateWorkingHours = async (
  staffUserId: string,
  workingHours: any[]
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: staffUserId,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  const staffId = user.staffProfile.id;

  const safeWorkingHours = Array.isArray(workingHours)
    ? workingHours
    : [];

  return prisma.$transaction(
    async (tx) => {
      return Promise.all(
        safeWorkingHours.map((wh) =>
          tx.workingHour.upsert({
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
    },
    { timeout: 15000 }
  );
};

/**
 * Get working hours
 */
export const getWorkingHours = async (
  staffUserId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: staffUserId,
    },

    include: {
      staffProfile: true,
    },
  });

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  const staffId = user.staffProfile.id;

  const hours = await prisma.workingHour.findMany({
    where: {
      staffId,
    },

    orderBy: {
      dayOfWeek: 'asc',
    },
  });

  return hours || [];
};

/**
 * Helper: Find staff user by either user.id or staffProfile.id
 */
const findStaffUser = async (id: string) => {
  let user = await prisma.user.findFirst({
    where: { id, role: Role.STAFF },
    include: { staffProfile: true },
  });

  if (!user) {
    const profile = await prisma.staffProfile.findUnique({
      where: { id },
      include: { user: true },
    });
    if (profile && profile.user) {
      user = { ...profile.user, staffProfile: profile } as any;
    }
  }

  return user;
};

/**
 * Soft-delete a staff member (preserves history)
 */
export const softDeleteStaff = async (staffUserId: string) => {
  const user = await findStaffUser(staffUserId);

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  // Mark staff profile as deleted
  await prisma.staffProfile.update({
    where: { id: user.staffProfile.id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false,
    },
  });

  // Deactivate user account so they can't log in
  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: false },
  });

  return { success: true, message: 'Staff member deleted' };
};

/**
 * Deactivate a staff member with reason and optional duration
 */
export const deactivateStaff = async (
  staffUserId: string,
  reason: string,
  deactivatedUntil?: string // ISO date string or undefined for indefinite
) => {
  const user = await findStaffUser(staffUserId);

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  if ((user.staffProfile as any).isDeleted) {
    throw new Error('Staff member has been deleted');
  }

  const untilDate = deactivatedUntil ? new Date(deactivatedUntil) : null;

  await prisma.staffProfile.update({
    where: { id: user.staffProfile.id },
    data: {
      isActive: false,
      deactivationReason: reason || 'No reason provided',
      deactivatedUntil: untilDate,
    } as any,
  });

  return prisma.user.findFirst({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      staffProfile: true,
    },
  });
};

/**
 * Reactivate a deactivated staff member
 */
export const reactivateStaff = async (staffUserId: string) => {
  const user = await findStaffUser(staffUserId);

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  if ((user.staffProfile as any).isDeleted) {
    throw new Error('Cannot reactivate a deleted staff member');
  }

  await prisma.staffProfile.update({
    where: { id: user.staffProfile.id },
    data: {
      isActive: true,
      deactivationReason: null,
      deactivatedUntil: null,
    } as any,
  });

  return prisma.user.findFirst({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      staffProfile: true,
    },
  });
};

/**
 * Get all appointments for a specific staff member (for admin view)
 */
export const getStaffAppointments = async (staffUserId: string) => {
  const user = await findStaffUser(staffUserId);

  if (!user || !user.staffProfile) {
    throw new Error('Staff not found');
  }

  const staffProfileId = user.staffProfile.id;

  const appointments = await prisma.appointment.findMany({
    where: { staffId: staffProfileId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          durationMinutes: true,
        },
      },
      rating: {
        select: {
          id: true,
          score: true,
          comment: true,
          satisfaction: true,
          createdAt: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  return appointments;
};

/**
 * Get all active (non-deleted) staff for admin appointment management
 */
export const getActiveStaffForAdmin = async () => {
  // Auto-reactivate staff whose deactivatedUntil has passed
  await prisma.staffProfile.updateMany({
    where: {
      isActive: false,
      isDeleted: false,
      deactivatedUntil: { lte: new Date(), not: null },
    },
    data: {
      isActive: true,
      deactivationReason: null,
      deactivatedUntil: null,
    },
  });

  const staff = await prisma.user.findMany({
    where: {
      role: Role.STAFF,
      staffProfile: { isDeleted: false },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
      staffProfile: {
        select: {
          id: true,
          imageUrl: true,
          isActive: true,
          isDeleted: true,
          deactivationReason: true,
          deactivatedUntil: true,
          position: true,
          _count: { select: { appointments: true } },
        },
      },
    },
    orderBy: { firstName: 'asc' },
  });

  return staff;
};