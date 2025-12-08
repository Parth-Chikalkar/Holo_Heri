import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Helper to get cookie (same as in your NavBar)
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const ProtectedRoute = () => {
  // 1. Check if the token exists in cookies
  const token = getCookie("tokenPassed");

  // 2. If token exists, render the child component (Outlet)
  // 3. If NO token, redirect to Home ("/")
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;