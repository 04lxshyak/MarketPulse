import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AUTH_API = 'http://localhost:8081/api/v1/auth';
const APP_API = 'http://localhost:8083/api';

// Create a custom axios instance for the app API
export const api = axios.create({
  baseURL: APP_API,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios interceptor
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  // Fetch /me on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${AUTH_API}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error("Auth initialization failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${AUTH_API}/login`, { email, password });
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      // Fetches user via useEffect hook automatically
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Login failed" };
    }
  };

  const register = async (email, password) => {
    try {
      await axios.post(`${AUTH_API}/register`, { email, password });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
