import { Appointment } from '../types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    customerName: 'Alice Johnson',
    serviceName: 'Hair Styling',
    staffName: 'Emma Style',
    date: '2026-08-15',
    time: '10:00 AM',
    status: 'Upcoming',
  },
  {
    id: 'apt-2',
    customerName: 'Bob Smith',
    serviceName: 'Facial Treatment',
    staffName: 'Olivia Glow',
    date: '2026-08-16',
    time: '02:00 PM',
    status: 'Upcoming',
  },
  {
    id: 'apt-3',
    customerName: 'Charlie Brown',
    serviceName: 'Nail Art',
    staffName: 'Sophia Nails',
    date: '2026-08-10',
    time: '11:00 AM',
    status: 'Completed',
  },
];
