import { prisma } from '../config/database';
import { calculateEndTime, getDayOfWeek } from '../utils/date';
import { AppointmentStatus, Role } from '@prisma/client';

const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Checks if a specific staff profile is available at the requested date, time, and service buffers.
 * Assumes the StaffProfile has been locked.
 * Optionally ignores a specific appointment ID (for rescheduling).
 */
const checkStaffAvailability = async (
  tx: any,
  staffProfileId: string,
  service: any,
  date: string,
  startTime: string,
  endTime: string,
  ignoreAppointmentId?: string
): Promise<boolean> => {
  const duration = service.durationMinutes;
  const bufferBefore = service.bufferBefore;
  const bufferAfter = service.bufferAfter;

  const reqStartMin = timeToMinutes(startTime);
  const reqEndMin = timeToMinutes(endTime);

  // 1. Check Working Hours
  const dayOfWeek = getDayOfWeek(date);
  const workingHour = await tx.workingHour.findUnique({
    where: { staffId_dayOfWeek: { staffId: staffProfileId, dayOfWeek } },
  });

  if (workingHour && workingHour.isDayOff) {
    return false;
  }

  const workStartMin = timeToMinutes(workingHour?.startTime || '09:00');
  const workEndMin = timeToMinutes(workingHour?.endTime || '18:00');

  if (reqStartMin < workStartMin || reqEndMin > workEndMin) {
    return false;
  }

  // 2. Check Blocked Periods
  const blockedPeriods = await tx.blockedPeriod.findMany({
    where: { staffId: staffProfileId, date },
  });

  for (const bp of blockedPeriods) {
    if (!bp.startTime || !bp.endTime) {
      return false; // Whole day is blocked
    }
    const bpStart = timeToMinutes(bp.startTime);
    const bpEnd = timeToMinutes(bp.endTime);

    if (Math.max(reqStartMin, bpStart) < Math.min(reqEndMin, bpEnd)) {
      return false; // Overlaps with blocked period
    }
  }

  // 3. Check Conflicting Appointments (taking buffers into account)
  const queryClause: any = {
    staffId: staffProfileId,
    date,
    status: {
      in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS],
    },
  };

  if (ignoreAppointmentId) {
    queryClause.id = { not: ignoreAppointmentId };
  }

  const appointments = await tx.appointment.findMany({
    where: queryClause,
    include: {
      service: {
        select: {
          bufferBefore: true,
          bufferAfter: true,
        },
      },
    },
  });

  for (const appt of appointments) {
    const apptStart = timeToMinutes(appt.startTime);
    const apptEnd = timeToMinutes(appt.endTime);
    const apptBufBefore = appt.service.bufferBefore;
    const apptBufAfter = appt.service.bufferAfter;

    // Existing occupied range
    const occStart1 = apptStart - apptBufBefore;
    const occEnd1 = apptEnd + apptBufAfter;

    // Requested occupied range
    const occStart2 = reqStartMin - bufferBefore;
    const occEnd2 = reqEndMin + bufferAfter;

    if (Math.max(occStart1, occStart2) < Math.min(occEnd1, occEnd2)) {
      return false; // Overlaps with existing appointment
    }
  }

  return true;
};

export const createAppointment = async (userId: string, data: any) => {
  return prisma.$transaction(async (tx) => {
    // 1. Get Service details
    const service = await tx.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.isActive) throw new Error('Service not found or inactive');

    // Calculate End Time
    const endTime = calculateEndTime(data.startTime, service.durationMinutes);

    let finalStaffProfileId = '';

    if (data.staffId) {
      // 2a. Specific staff member chosen
      const staffUser = await tx.user.findUnique({
        where: { id: data.staffId, isActive: true },
        include: {
          staffProfile: {
            include: {
              services: { where: { serviceId: data.serviceId } },
            },
          },
        },
      });

      if (!staffUser || !staffUser.staffProfile) {
        throw new Error('Staff not found or inactive');
      }

      if (staffUser.staffProfile.isActive === false) {
        throw new Error('Staff member is deactivated');
      }

      if (staffUser.staffProfile.services.length === 0) {
        throw new Error('Staff does not provide this service');
      }

      finalStaffProfileId = staffUser.staffProfile.id;

      // Lock this staff profile row for update to prevent concurrent double-bookings
      await tx.$executeRawUnsafe(
        `SELECT id FROM "StaffProfile" WHERE id = '${finalStaffProfileId}' FOR UPDATE`
      );

      // Check availability
      const isAvailable = await checkStaffAvailability(
        tx,
        finalStaffProfileId,
        service,
        data.date,
        data.startTime,
        endTime
      );

      if (!isAvailable) {
        // Build a user-friendly message showing the exact booked time
        const staffName = `${staffUser.firstName || ''} ${staffUser.lastName || ''}`.trim();
        const [h, m] = data.startTime.split(':').map(Number);
        const suffix = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        const timeLabel = `${hour}:${String(m).padStart(2, '0')} ${suffix}`;

        const [eh, em] = endTime.split(':').map(Number);
        const endSuffix = eh >= 12 ? 'PM' : 'AM';
        const endHour = eh % 12 || 12;
        const endTimeLabel = `${endHour}:${String(em).padStart(2, '0')} ${endSuffix}`;

        throw new Error(`${timeLabel}–${endTimeLabel} is already booked with ${staffName || 'this stylist'}. Please choose another time.`);
      }
    } else {
      // 2b. "Any available stylist" chosen
      const eligibleProfiles = await tx.staffProfile.findMany({
        where: {
          isActive: true,
          user: { isActive: true },
          services: { some: { serviceId: data.serviceId } },
        },
      });

      if (eligibleProfiles.length === 0) {
        throw new Error('No staff members are available for this service at the selected time.');
      }

      // Lock all candidate profiles to prevent race conditions
      for (const profile of eligibleProfiles) {
        await tx.$executeRawUnsafe(
          `SELECT id FROM "StaffProfile" WHERE id = '${profile.id}' FOR UPDATE`
        );
      }

      // Search for first available staff
      for (const profile of eligibleProfiles) {
        const isAvailable = await checkStaffAvailability(
          tx,
          profile.id,
          service,
          data.date,
          data.startTime,
          endTime
        );

        if (isAvailable) {
          finalStaffProfileId = profile.id;
          break;
        }
      }

      if (!finalStaffProfileId) {
        throw new Error('No staff members are available for this service at the selected time.');
      }
    }

    // 3. Create Appointment
    const appointment = await tx.appointment.create({
      data: {
        userId,
        staffId: finalStaffProfileId,
        serviceId: data.serviceId,
        date: data.date,
        startTime: data.startTime,
        endTime,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        notes: data.notes || null,
        status: AppointmentStatus.PENDING,
      },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: true,
      },
    });

    // 4. Create Notification for Admin
    const adminUser = await tx.user.findFirst({ where: { role: Role.ADMIN } });
    if (adminUser) {
      await tx.notification.create({
        data: {
          userId: adminUser.id,
          title: 'New Appointment Booked',
          message: `Appointment for ${data.date} at ${data.startTime} booked by user. Assigned to staff.`,
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

export const getAllAppointments = async (
  page: number,
  limit: number,
  status?: AppointmentStatus,
  date?: string,
  staffId?: string,
  serviceId?: string,
  userId?: string
) => {
  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (date) whereClause.date = date;
  if (staffId) whereClause.staffId = staffId;
  if (serviceId) whereClause.serviceId = serviceId;
  if (userId) whereClause.userId = userId;

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true, price: true, durationMinutes: true } },
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

export const updateAppointmentStatus = async (
  id: string,
  userId: string,
  role: string,
  status: AppointmentStatus,
  cancellationReason?: string
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { staff: { select: { userId: true } } },
  });

  if (!appointment) throw new Error('Appointment not found');

  // Permissions check
  if (role === Role.USER) {
    if (appointment.userId !== userId) throw new Error('Unauthorized');
    if (status !== AppointmentStatus.CANCELLED) {
      throw new Error('Users can only cancel appointments');
    }
  } else if (role === Role.STAFF) {
    if (appointment.staff.userId !== userId) throw new Error('Unauthorized');
  }

  const updateData: any = { status };
  if (status === AppointmentStatus.CANCELLED) {
    updateData.cancellationReason = cancellationReason || 'Cancelled by user';
    updateData.cancelledAt = new Date();
  }

  return prisma.appointment.update({
    where: { id },
    data: updateData,
    include: {
      staff: { include: { user: { select: { firstName: true, lastName: true } } } },
      service: true,
    },
  });
};

export const rescheduleAppointment = async (
  id: string,
  userId: string,
  role: string,
  data: { date: string; startTime: string; staffId?: string }
) => {
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        staff: true,
      },
    });

    if (!appointment) throw new Error('Appointment not found');

    // Permissions check
    if (role === Role.USER) {
      if (appointment.userId !== userId) throw new Error('Unauthorized');
    }

    const service = appointment.service;
    const endTime = calculateEndTime(data.startTime, service.durationMinutes);

    let targetStaffProfileId = appointment.staffId;
    if (data.staffId) {
      // If customer wants to change staff member, lookup target staff user
      const staffUser = await tx.user.findUnique({
        where: { id: data.staffId, isActive: true },
        include: { staffProfile: true },
      });
      if (!staffUser || !staffUser.staffProfile) {
        throw new Error('Target staff member not found or inactive');
      }
      targetStaffProfileId = staffUser.staffProfile.id;
    }

    // Lock the staff profile row for update
    await tx.$executeRawUnsafe(
      `SELECT id FROM "StaffProfile" WHERE id = '${targetStaffProfileId}' FOR UPDATE`
    );

    // Validate availability
    const isAvailable = await checkStaffAvailability(
      tx,
      targetStaffProfileId,
      service,
      data.date,
      data.startTime,
      endTime,
      id // Pass appointment ID to ignore it during collision check
    );

    if (!isAvailable) {
      throw new Error('This slot/staff member is not available.');
    }

    return tx.appointment.update({
      where: { id },
      data: {
        date: data.date,
        startTime: data.startTime,
        endTime,
        staffId: targetStaffProfileId,
        rescheduledAt: new Date(),
        rescheduledFromId: appointment.id,
      },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: true,
      },
    });
  });
};
