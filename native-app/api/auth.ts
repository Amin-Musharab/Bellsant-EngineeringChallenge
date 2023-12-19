import apiClient from '../api/client';

export const signup = async (username: string, password: string) => {
  const { data } = await apiClient.post('/signup', {
    username,
    password,
  });

  return data;
};

export const login = async (username: string, password: string) => {
  const { data } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>('/login', {
    username,
    password,
  });

  return data;
};

export const token = async (refreshToken: string) => {
  const { data } = await apiClient.post<{ accessToken: string }>('/token', {
    refreshToken,
  });

  return data;
};

export const logout = async (refreshToken: string) => {
  const { data } = await apiClient.post('/logout', {
    refreshToken,
  });

  return data;
};
