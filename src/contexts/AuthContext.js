import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);
const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/user/login', {
      email: credentials.email,
      password: credentials.password
    });

    const { access_token, role } = response.data;

    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    // Create user data object with role and email
    const userData = {
      email: credentials.email,
      role: role,
      token: access_token
    };

    localStorage.setItem('authToken', access_token);
    localStorage.setItem('userData', JSON.stringify(userData));

    setIsAuthenticated(true);
    setUser(userData);

    toast.success('Login successful!');
    return true;

  } catch (error) {
    console.error('Login error:', error);

    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;

      if (Array.isArray(detail)) {
        detail.forEach((err) => {
          toast.error(err.msg);
        });
      } else if (typeof detail === 'string') {
        toast.error(detail);
      } else {
        toast.error('An unknown error occurred');
      }
    } else {
      toast.error('Login failed. Please check your credentials.');
    }

    return false;
  }
};


  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put('http://localhost:8000/api/v1/profile/me', updatedData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 