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
    // Check if data contains files
    if (data.files && data.files.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        companyName: data.data?.companyName,
        positionTitle: data.data?.positionTitle,
        jobUrl: data.data?.jobUrl,
        jobDescription: data.data?.jobDescription,
        qualifications: data.data?.qualifications,
        notes: data.data?.notes,
        salary: data.data?.salary,
        location: data.data?.location,
        jobType: data.data?.jobType,
        status: data.data?.status || 'APPLIED'
      }));
      
      // Add files to FormData
      data.files.forEach(file => {
        formData.append('files', file.file);
      });
      
      const response = await api.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      // No files, use regular JSON
      const response = await api.post('/api/applications', data);
      return response.data;
    }
  },

  update: async (id: string, data: UpdateApplicationDTO): Promise<Application> => {
    // Send data directly as JSON object (not nested in 'data' property)
    // Backend expects: { companyName: '...', positionTitle: '...', ... }
    // NOT: { data: { companyName: '...', ... } }
    const response = await api.put(`/api/applications/${id}`, data.data || {});
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/applications/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await api.post(`/api/applications/${id}/restore`);
  }
};
