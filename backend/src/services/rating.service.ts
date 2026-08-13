import { prisma } from '../config/database';
import { AppointmentStatus } from '@prisma/client';

export const createRating = async (userId: string, data: any) => {
  return prisma.$transaction(async (tx) => {
    // Check if appointment exists and belongs to user
    const appointment = await tx.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) throw new Error('Appointment not found');
    if (appointment.userId !== userId) throw new Error('Unauthorized');
    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new Error('Can only rate completed appointments');
    }

    // Check if rating already exists
    const existingRating = await tx.rating.findUnique({
      where: { appointmentId: data.appointmentId },
    });

    if (existingRating) {
      throw new Error('You have already rated this appointment');
    }

    return tx.rating.create({
      data: {
        userId,
        appointmentId: data.appointmentId,
        staffId: appointment.staffId,
        serviceId: appointment.serviceId,
        score: data.score,
        comment: data.comment,
      },
    });
  });
};

export const getRatingsByStaff = async (staffId: string) => {
  return prisma.rating.findMany({
    where: { staffId },
    include: {
      user: { select: { firstName: true, lastName: true } },
      service: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getRatingsByService = async (serviceId: string) => {
  return prisma.rating.findMany({
    where: { serviceId },
    include: {
      user: { select: { firstName: true, lastName: true } },
      staff: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
