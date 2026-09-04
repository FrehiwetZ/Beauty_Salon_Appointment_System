import { api } from './api';

export const staffService = {
  getStaff: async (
    page = 1,
    limit = 10,
    search = ''
  ) => {
    const response = await api.get('/staff', {
      params: {
        page,
        limit,
        search,
      },
    });

    return response.data;
  },

  getStaffById: async (id: string) => {
    const response = await api.get(`/staff/${id}`);

    return response.data;
  },

  createStaff: async (data: any) => {
    console.log('Sending create staff request:', data);

    const response = await api.post('/staff', data);

    console.log('Create staff response:', response.data);

    return response.data;
  },

  updateStaff: async (
    id: string,
    data: any
  ) => {
    const response = await api.patch(
      `/staff/${id}`,
      data
    );

    return response.data;
  },
};