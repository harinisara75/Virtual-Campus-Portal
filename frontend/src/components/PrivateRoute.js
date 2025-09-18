import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple wrapper that redirects to /login if no user
export default function PrivateRoute({ user, children }){
  if (!user) return <Navigate to='/login' />;
  return children;
}
