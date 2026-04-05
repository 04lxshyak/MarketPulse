import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, clearToken } from '../../utils/auth';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
    };
    
    // Listen for global 401 events thrown by Axios interceptor
    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  if (!isAuthenticated) {
    clearToken();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
