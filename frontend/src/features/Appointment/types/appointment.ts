export interface Appointment {
  id: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}
