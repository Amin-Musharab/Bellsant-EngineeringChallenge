import React, { createContext, useCallback, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import * as authApi from '../api/auth';
import * as userApi from '../api/user';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants';

interface IUser {
  username: string;
}

interface IAuthContextValue {
  user?: IUser;
  loadingUser: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContextValue>({
  login: () => Promise.reject(),
  logout: () => Promise.reject(),
  signup: () => Promise.reject(),
  hydrate: () => Promise.reject(),
  loadingUser: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const storeToken = async (tokenName: string, tokenValue: string) => {
    await SecureStore.setItemAsync(tokenName, tokenValue);
  };

  const getToken = async (tokenName: string) => {
    return await SecureStore.getItemAsync(tokenName);
  };

  const removeToken = async (tokenName: string) => {
    await SecureStore.deleteItemAsync(tokenName);
  };

  const hydrate = useCallback(async () => {
    try {
      setLoadingUser(true);
      const user = await userApi.me();
      setUser(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setLoadingUser(true);
      const data = await authApi.login(username, password);
      setUser({ username });
      await storeToken(ACCESS_TOKEN_KEY, data.accessToken);
      await storeToken(REFRESH_TOKEN_KEY, data.refreshToken);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoadingUser(true);
      const refreshToken = await getToken(REFRESH_TOKEN_KEY);
      await authApi.logout(refreshToken);
      setUser(null);
      await removeToken(ACCESS_TOKEN_KEY);
      await removeToken(REFRESH_TOKEN_KEY);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    try {
      setLoadingUser(true);
      await authApi.signup(username, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const value = { user, loadingUser, login, logout, signup, hydrate };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
