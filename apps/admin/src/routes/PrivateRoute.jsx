import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

