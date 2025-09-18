// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // We'll use the central api service

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  useEffect(() => {
    // If a token exists, try to validate it and fetch user data on app load
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // You could add an API call here to get user details if needed
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newAccessToken, refreshToken, user: userData } = response.data;
      
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newAccessToken);
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      
      navigate('/'); // Redirect to homepage on successful login
      return true;

    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};