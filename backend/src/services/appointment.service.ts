import { prisma } from '../config/database';
import { calculateEndTime, isTimeOverlapping, getDayOfWeek } from '../utils/date';
import { AppointmentStatus } from '@prisma/client';

export const createAppointment = async (userId: string, data: any) => {
  return prisma.$transaction(async (tx) => {
    // 1. Get Service details
    const service = await tx.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.isActive) throw new Error('Service not found or inactive');

    // 2. Check Staff and StaffService link
    const staff = await tx.user.findUnique({
      where: { id: data.staffId, isActive: true },
      include: {
        staffProfile: {
          include: {
            services: { where: { serviceId: data.serviceId } },
          },
        },
      },
    });

    if (!staff || !staff.staffProfile) throw new Error('Staff not found or inactive');
    if (staff.staffProfile.services.length === 0) throw new Error('Staff does not provide this service');

    // 3. Calculate End Time
    const endTime = calculateEndTime(data.startTime, service.durationMinutes);

    // 4. Check Working Hours
    const dayOfWeek = getDayOfWeek(data.date);
    const workingHour = await tx.workingHour.findUnique({
      where: { staffId_dayOfWeek: { staffId: staff.staffProfile.id, dayOfWeek } },
    });

    if (!workingHour || workingHour.isDayOff) {
      throw new Error('Staff is not working on this day');
    }

    if (data.startTime < workingHour.startTime || endTime > workingHour.endTime) {
      throw new Error('Appointment time is outside staff working hours');
    }

    // 5. Check Double Booking
    const existingAppointments = await tx.appointment.findMany({
      where: {
        staffId: staff.staffProfile.id,
        date: data.date,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
    });

    const hasConflict = existingAppointments.some((appt) => 
      isTimeOverlapping(data.startTime, endTime, appt.startTime, appt.endTime)
    );

    if (hasConflict) {
      throw new Error('Staff is already booked at this time');
    }

    // 6. Create Appointment
    const appointment = await tx.appointment.create({
      data: {
        userId,
        staffId: staff.staffProfile.id,
        serviceId: data.serviceId,
        date: data.date,
        startTime: data.startTime,
        endTime,
        status: AppointmentStatus.PENDING,
      },
    });

    // 7. Create Notification for Admin (optional, but requested in rules)
    const adminUser = await tx.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminUser) {
      await tx.notification.create({
        data: {
          userId: adminUser.id,
          title: 'New Appointment Booked',
          message: `Appointment for ${data.date} at ${data.startTime} booked by user ${userId}.`,
        },
      });
    }

    return appointment;
  });
};

export const getAppointmentsByUser = async (userId: string) => {
  return prisma.appointment.findMany({
    where: { userId },
    include: {
      staff: { include: { user: { select: { firstName: true, lastName: true } } } },
      service: { select: { name: true, price: true, durationMinutes: true } },
    },
    orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
  });
};

export const getAppointmentsByStaff = async (staffProfileId: string) => {
  return prisma.appointment.findMany({
    where: { staffId: staffProfileId },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      service: { select: { name: true, price: true, durationMinutes: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
};

export const getAllAppointments = async (page: number, limit: number, status?: AppointmentStatus) => {
  const skip = (page - 1) * limit;
  const whereClause: any = status ? { status } : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true } },
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true, price: true } },
      },
      skip,
      take: limit,
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    }),
    prisma.appointment.count({ where: whereClause }),
  ]);

  return {
    data: appointments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateAppointmentStatus = async (id: string, userId: string, role: string, status: AppointmentStatus) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { staff: { select: { userId: true } } },
  });

  if (!appointment) throw new Error('Appointment not found');

  // Permissions: 
  // User can only cancel their own.
  // Staff can update their own.
  // Admin can do anything.
  if (role === 'USER') {
    if (appointment.userId !== userId) throw new Error('Unauthorized');
    if (status !== AppointmentStatus.CANCELLED) throw new Error('Users can only cancel appointments');
  } else if (role === 'STAFF') {
    if (appointment.staff.userId !== userId) throw new Error('Unauthorized');
  }

  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
};
