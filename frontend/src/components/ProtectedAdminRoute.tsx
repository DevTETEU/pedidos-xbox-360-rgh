import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminAuthenticated } from '../utils/adminAuth';

interface Props {
  children: React.ReactElement;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedAdminRoute;
