// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../partials/components/LoadingSpinner';


export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  return isAuthenticated ? children : <Navigate to="/signin" replace />
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, roles } = useAuth()
  
  if (loading) return <LoadingSpinner />
  return isAuthenticated && roles.includes('Admin') ? children : <Navigate to="/projects" replace />
};