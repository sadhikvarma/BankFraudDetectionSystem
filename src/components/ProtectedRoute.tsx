import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: ('normal' | 'bank_admin' | 'project_admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes = ['normal', 'bank_admin', 'project_admin'] 
}) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (currentUser && !allowedUserTypes.includes(currentUser.userType)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;