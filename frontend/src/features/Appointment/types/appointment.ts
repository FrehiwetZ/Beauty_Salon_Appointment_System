export interface Appointment {
  id: string;
  userId?: string;
  staffId?: string;
  serviceId?: string;
  customerName: string;
  customerPhone?: string;
  serviceName?: string;
  staffName?: string;
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'REJECTED';
}
