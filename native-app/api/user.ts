import apiClient from '../api/client';

export const me = async () => {
  const { data } = await apiClient.get('/me');

  return data;
};
