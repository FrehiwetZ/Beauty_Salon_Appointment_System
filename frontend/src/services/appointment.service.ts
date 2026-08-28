import { api } from './api';

export const appointmentService = {
  getMyAppointments: async (page = 1, limit = 10) => {
    const response = await api.get('/appointments/my-appointments', { params: { page, limit } });
    return response.data;
  },
  
  bookAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  
  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }
};
