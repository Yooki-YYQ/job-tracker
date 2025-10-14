import { api } from './client';
import type { ApplicationFile } from '@/types';

export const fileApi = {
  // Upload files for an application
  uploadFiles: async (applicationId: string, files: FileList | File[]): Promise<{ files: ApplicationFile[] }> => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post(`/api/applications/${applicationId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get files for an application
  getFiles: async (applicationId: string): Promise<ApplicationFile[]> => {
    const response = await api.get(`/api/applications/${applicationId}/files`);
    return response.data;
  },

  // Download a file
  downloadFile: (fileId: string): string => {
    return `${api.defaults.baseURL}/api/applications/files/${fileId}/download`;
  },

  // Delete a file
  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/api/applications/files/${fileId}`);
  }
};
