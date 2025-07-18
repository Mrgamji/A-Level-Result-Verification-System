
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  const login = async (type, credentials) => {
    try {
      const endpoint = type === 'admin' ? '/admin/login' : '/auth/login';
      const response = await api.post(endpoint, credentials);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userData', JSON.stringify({
        user: response.data.user,
        userType: type
      }));

      setAuthData({
        user: response.data.user,
        token: response.data.token,
        userType: type
      });
    
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create and export useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Optional: Export the context itself if needed elsewhere
export default AuthContext;