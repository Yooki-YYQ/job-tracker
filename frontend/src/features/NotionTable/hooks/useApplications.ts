import { useState, useEffect, useCallback } from 'react';
import { applicationApi } from '@/services/api';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '@/types';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationApi.getAll();
      setApplications(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (data: CreateApplicationDTO): Promise<Application> => {
    try {
      const newApp = await applicationApi.create(data);
      setApplications(prev => [...prev, newApp]);
      return newApp;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const updateApplication = useCallback(async (id: string, data: UpdateApplicationDTO): Promise<Application> => {
    try {
      const updatedApp = await applicationApi.update(id, data);
      setApplications(prev => prev.map(app => 
        app.id === id ? updatedApp : app
      ));
      return updatedApp;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const deleteApplication = useCallback(async (id: string): Promise<void> => {
    try {
      await applicationApi.delete(id);
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const getApplicationById = useCallback((id: string): Application | undefined => {
    return applications.find(app => app.id === id);
  }, [applications]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationById,
    refreshApplications: loadApplications
  };
}
