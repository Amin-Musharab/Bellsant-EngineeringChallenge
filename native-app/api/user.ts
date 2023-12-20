import apiClient from '../api/client';

export const me = async () => {
  const { data } = await apiClient.get('/me');

  return data;
};

export const persistMachineData = async (machineData: Record<string, any>) => {
  const { data } = await apiClient.post('/me/persist-machine-data', {
    machineData,
  });

  return data;
};

export const removeMachineData = async () => {
  const { data } = await apiClient.delete('/me/machine-data');

  return data;
};
