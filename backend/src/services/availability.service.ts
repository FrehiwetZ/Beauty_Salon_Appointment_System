import { prisma } from '../config/database';
import { AppointmentStatus, Role } from '@prisma/client';
import { getDayOfWeek } from '../utils/date';

export interface AvailableStaff {
  id: string;
  firstName: string;
  lastName: string;
}

export interface AvailableSlot {
  time: string;
  availableStaff: AvailableStaff[];
}

const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const getAvailableSlots = async (
  serviceId: string,
  date: string,
  staffId?: string
): Promise<AvailableSlot[]> => {
  // 1. Get service details
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service || !service.isActive) {
    throw new Error('Service not found or inactive');
  }

  const duration = service.durationMinutes;
  const bufferBefore = service.bufferBefore;
  const bufferAfter = service.bufferAfter;

  // 2. Find eligible staff assigned to this service
  const staffQuery: any = {
    role: Role.STAFF,
    isActive: true,
    staffProfile: {
      isActive: true,
      services: {
        some: {
          serviceId,
        },
      },
    },
  };

  if (staffId) {
    staffQuery.id = staffId;
  }

  const staffList = await prisma.user.findMany({
    where: staffQuery,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      staffProfile: {
        select: {
          id: true,

          // Staff working hours for this day
          workingHours: {
            where: {
              dayOfWeek: getDayOfWeek(date),
            },
          },

          // Staff blocked periods for this date
          blockedPeriods: {
            where: {
              date,
            },
          },

          // Existing appointments for this date
          appointments: {
            where: {
              date,
              status: {
                in: [
                  AppointmentStatus.PENDING,
                  AppointmentStatus.CONFIRMED,
                ],
              },
            },
            include: {
              service: {
                select: {
                  bufferBefore: true,
                  bufferAfter: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const slotsMap: { [time: string]: AvailableStaff[] } = {};

  // 3. Calculate available slots for each staff member
  for (const staff of staffList) {
    if (!staff.staffProfile) continue;

    const profile = staff.staffProfile;

    const workingHour = profile.workingHours[0];

    // Explicit day off
    if (workingHour && workingHour.isDayOff) {
      continue;
    }

    // Default working hours if no working-hours record exists
    const startMin = timeToMinutes(
      workingHour?.startTime || '09:00'
    );

    const endMin = timeToMinutes(
      workingHour?.endTime || '18:00'
    );

    // Generate slots every 30 minutes
    for (
      let slotMin = startMin;
      slotMin + duration <= endMin;
      slotMin += 30
    ) {
      const slotTimeStr = minutesToTime(slotMin);

      // -----------------------------------------
      // Check blocked periods
      // -----------------------------------------
      let isBlocked = false;

      for (const bp of profile.blockedPeriods) {
        // No start/end means the entire day is blocked
        if (!bp.startTime || !bp.endTime) {
          isBlocked = true;
          break;
        }

        const bpStart = timeToMinutes(bp.startTime);
        const bpEnd = timeToMinutes(bp.endTime);

        // Check whether requested slot overlaps blocked period
        if (
          Math.max(slotMin, bpStart) <
          Math.min(slotMin + duration, bpEnd)
        ) {
          isBlocked = true;
          break;
        }
      }

      if (isBlocked) continue;

      // -----------------------------------------
      // Check existing appointments
      // -----------------------------------------
      let hasConflict = false;

      for (const appt of profile.appointments) {
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);

        const apptBufBefore = appt.service.bufferBefore;
        const apptBufAfter = appt.service.bufferAfter;

        // Existing appointment occupied range
        const occupiedStart = apptStart - apptBufBefore;
        const occupiedEnd = apptEnd + apptBufAfter;

        // Requested appointment occupied range
        const requestedStart = slotMin - bufferBefore;
        const requestedEnd =
          slotMin + duration + bufferAfter;

        // Check overlap
        if (
          Math.max(occupiedStart, requestedStart) <
          Math.min(occupiedEnd, requestedEnd)
        ) {
          hasConflict = true;
          break;
        }
      }

      if (hasConflict) continue;

      // -----------------------------------------
      // Slot is available
      // -----------------------------------------
      if (!slotsMap[slotTimeStr]) {
        slotsMap[slotTimeStr] = [];
      }

      slotsMap[slotTimeStr].push({
        id: staff.id,
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
      });
    }
  }

  // 4. Format and sort available slots
  const availableSlots: AvailableSlot[] = Object.keys(slotsMap)
    .sort()
    .map((time) => ({
      time,
      availableStaff: slotsMap[time],
    }));

  return availableSlots;
};