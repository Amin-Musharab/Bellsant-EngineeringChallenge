import apiClient from './client';

export const getMachineHealth = async (machines: Record<string, any>) => {
  const { data } = await apiClient.post('/machine-health', { machines });

  return data;
};
