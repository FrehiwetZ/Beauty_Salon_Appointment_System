import { prisma } from '../config/database';
import { AppointmentStatus, Role } from '@prisma/client';

export const getAdminDashboardData = async () => {
  const [
    totalUsers,
    totalStaff,
    totalAppointments,
    completedAppointments,
    totalRevenueData,
    recentAppointments,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.USER } }),
    prisma.user.count({ where: { role: Role.STAFF } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
    prisma.appointment.findMany({
      where: { status: AppointmentStatus.COMPLETED },
      include: { service: { select: { price: true } } },
    }),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = totalRevenueData.reduce((acc, curr) => acc + curr.service.price, 0);

  return {
    totalUsers,
    totalStaff,
    totalAppointments,
    completedAppointments,
    totalRevenue,
    currency: 'ETB',
    recentAppointments,
  };
};

export const getStaffDashboardData = async (staffId: string) => {
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId: staffId },
  });

  if (!staffProfile) throw new Error('Staff profile not found');

  const today = new Date();
  const dateString = today.toISOString().split('T')[0];

  const [
    totalAppointments,
    upcomingAppointments,
    completedAppointments,
    todaysAppointments,
    ratingsData,
  ] = await Promise.all([
    prisma.appointment.count({ where: { staffId: staffProfile.id } }),
    prisma.appointment.count({
      where: {
        staffId: staffProfile.id,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        date: { gte: dateString },
      },
    }),
    prisma.appointment.count({ where: { staffId: staffProfile.id, status: AppointmentStatus.COMPLETED } }),
    prisma.appointment.findMany({
      where: {
        staffId: staffProfile.id,
        date: dateString,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        service: { select: { name: true, durationMinutes: true } },
      },
      orderBy: { startTime: 'asc' },
    }),
    prisma.rating.findMany({
      where: { staffId: staffProfile.id },
      select: { score: true },
    }),
  ]);

  const averageRating =
    ratingsData.length > 0
      ? ratingsData.reduce((acc, curr) => acc + curr.score, 0) / ratingsData.length
      : 0;

  return {
    totalAppointments,
    upcomingAppointments,
    completedAppointments,
    averageRating,
    todaysAppointments,
  };
};

export const getUserDashboardData = async (userId: string) => {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];

  const [
    totalAppointments,
    upcomingAppointments,
    recentAppointments,
  ] = await Promise.all([
    prisma.appointment.count({ where: { userId } }),
    prisma.appointment.findMany({
      where: {
        userId,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        date: { gte: dateString },
      },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    }),
    prisma.appointment.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalAppointments,
    upcomingAppointments,
    recentAppointments,
  };
};
