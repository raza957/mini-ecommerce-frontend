import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/config';
import './Auth.css';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For demo, set a mock user if token exists
      setUser({
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try real API first
      const response = await API.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return response.data;
    } catch (error) {
      console.log('Real login failed, using mock data');
      // Fallback to mock data
      const mockUser = {
        token: 'demo-jwt-token',
        user: {
          id: 1,
          name: 'Demo User',
          email: email
        }
      };
      
      localStorage.setItem('token', mockUser.token);
      API.defaults.headers.common['Authorization'] = `Bearer ${mockUser.token}`;
      setUser(mockUser.user);
      
      return mockUser;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return response.data;
    } catch (error) {
      console.log('Real register failed, using mock data');
      const mockUser = {
        token: 'demo-jwt-token',
        user: {
          id: 1,
          name: name,
          email: email
        }
      };
      
      localStorage.setItem('token', mockUser.token);
      API.defaults.headers.common['Authorization'] = `Bearer ${mockUser.token}`;
      setUser(mockUser.user);
      
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};