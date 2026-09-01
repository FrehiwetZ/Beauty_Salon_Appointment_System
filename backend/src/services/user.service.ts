import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const updateData: any = { ...data };
  
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  });
  return user;
};

export const getAllUsers = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  // Cascade delete related records manually to prevent foreign key violations
  await prisma.rating.deleteMany({ where: { userId: id } });
  await prisma.notification.deleteMany({ where: { userId: id } });
  await prisma.post.deleteMany({ where: { authorId: id } });
  await prisma.appointment.deleteMany({ where: { userId: id } });

  // If the user is a staff member, delete their staff profile and assignments
  const staffProfile = await prisma.staffProfile.findUnique({ where: { userId: id } });
  if (staffProfile) {
    await prisma.staffService.deleteMany({ where: { staffId: staffProfile.id } });
    await prisma.workingHour.deleteMany({ where: { staffId: staffProfile.id } });
    await prisma.blockedPeriod.deleteMany({ where: { staffId: staffProfile.id } });
    await prisma.staffProfile.delete({ where: { id: staffProfile.id } });
  }

  return prisma.user.delete({
    where: { id },
  });
};
