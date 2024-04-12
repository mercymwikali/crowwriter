// PrivateRoute.js
import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const PrivateRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation(); // Call useLocation to get the location object

  // Check if auth is defined and has roles
  if (auth && auth.roles) {
    // Check if at least one allowed role matches the user's roles
    const hasPermission = auth.roles.some(role => allowedRoles?.includes(role));

    return hasPermission ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If auth or auth.roles is undefined, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};
export default PrivateRoute;
