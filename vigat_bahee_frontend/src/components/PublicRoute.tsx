// src/components/PublicRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // कहाँ redirect करना है
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/bahee' 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // अगर user authenticated है, तो redirect करें
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // अगर user authenticated नहीं है, तो children render करें
  return <>{children}</>;
};

export default PublicRoute;