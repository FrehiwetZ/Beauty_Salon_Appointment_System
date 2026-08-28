import { api } from './api';

export const serviceService = {
  getServices: async (page = 1, limit = 50, search = '') => {
    const response = await api.get('/services', { params: { page, limit, search } });
    return response.data;
  },
  
  getServiceById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  createService: async (data: any) => {
    const response = await api.post('/services', data);
    return response.data;
  },
  
  updateService: async (id: string, data: any) => {
    const response = await api.patch(`/services/${id}`, data);
    return response.data;
  }
};
