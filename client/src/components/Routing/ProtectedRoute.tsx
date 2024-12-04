import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingAnimation } from '../Loading/Loading';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <LoadingAnimation
      isLoading = {isLoading}
      text='Loading..' />
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};