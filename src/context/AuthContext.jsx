import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { authService } from '../services/authService';
import i18n from '../i18n';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on page refresh
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user/profile');
          setUser(res.data);
          if (res.data.preferredLanguage === 'en' || res.data.preferredLanguage === 'km') {
            await i18n.changeLanguage(res.data.preferredLanguage);
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    if (data.user.preferredLanguage === 'en' || data.user.preferredLanguage === 'km') {
      await i18n.changeLanguage(data.user.preferredLanguage);
    }
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password, i18n.resolvedLanguage || 'en');
    localStorage.setItem('token', data.token);
    setUser(data.user);
    if (data.user.preferredLanguage === 'en' || data.user.preferredLanguage === 'km') {
      await i18n.changeLanguage(data.user.preferredLanguage);
    }
    return data.user;
  };

  const updateUser = (updatedUser) => {
    setUser((currentUser) => ({ ...currentUser, ...updatedUser }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};