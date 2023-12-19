import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from '../constants';

let baseURL: string = 'https://fancy-dolphin-65b07b.netlify.app/api';

if (__DEV__) {
  baseURL = `http://${
    Platform?.OS === 'android' ? '10.0.2.2' : 'localhost'
  }:3001`;
}

const apiClient = axios.create({
  baseURL,
});

// Request Interceptor to add the access token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to refresh token if expired
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a token refresh error
    if (
      error.response?.status === 401 ||
      (error.response?.status === 403 && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      try {
        const { data } = await axios.post(`${baseURL}/token`, {
          refreshToken,
        });
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
