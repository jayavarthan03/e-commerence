import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create an Axios instance that we can export for easy API requests
export const api = axios.create({
  baseURL: '',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user token from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Configure global axios header
          api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      
      // Store in localStorage
      localStorage.setItem('user_data', JSON.stringify(data));
      
      // Update Axios auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setUser(data);
      
      // Store in localStorage
      localStorage.setItem('user_data', JSON.stringify(data));
      
      // Update Axios auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/api/auth/profile', profileData);
      
      // Merge updated fields with current token
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${updatedUser.token}`;
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
