import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('ems_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem('ems_token') || '');
  const [loading, setLoading] = useState(true);

  const syncSession = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('ems_token', nextToken);
      setToken(nextToken);
    } else {
      localStorage.removeItem('ems_token');
      setToken('');
    }

    if (nextUser) {
      localStorage.setItem('ems_user', JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      localStorage.removeItem('ems_user');
      setUser(null);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authService.getProfile();
        syncSession(token, data.user);
      } catch {
        syncSession('', null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const { data } = await authService.login(payload);
    syncSession(data.token, data.user);
    toast.success(data.message || 'Logged in successfully');
    return data;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    syncSession(data.token, data.user);
    toast.success(data.message || 'Registration successful');
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      syncSession('', null);
      toast.success('Logged out successfully');
    }
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const { data } = await authService.getProfile();
    syncSession(token, data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await authService.updateProfile(payload);
    syncSession(token, data.user);
    toast.success(data.message || 'Profile updated');
    return data;
  };

  const forgotPassword = async (payload) => {
    const { data } = await authService.forgotPassword(payload);
    toast.success(data.message || 'Reset link sent');
    return data;
  };

  const resetPassword = async (payload) => {
    const { data } = await authService.resetPassword(payload);
    syncSession(data.token, data.user);
    toast.success(data.message || 'Password reset successful');
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      forgotPassword,
      resetPassword,
      setUser,
      setToken
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);