import { api } from './client';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '@/types';

export const applicationApi = {
  getAll: async (): Promise<Application[]> => {
    const response = await api.get('/api/applications');
    return response.data;
  },

  getById: async (id: string): Promise<Application> => {
    const response = await api.get(`/api/applications/${id}`);
    return response.data;
  },

  create: async (data: CreateApplicationDTO): Promise<Application> => {
    const response = await api.post('/api/applications', data);
    return response.data;
  },

  update: async (id: string, data: UpdateApplicationDTO): Promise<Application> => {
    const response = await api.put(`/api/applications/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/applications/${id}`);
  }
};
