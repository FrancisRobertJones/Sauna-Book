import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './state/userContext';
export const AdminRoute = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isChecking, setIsChecking] = useState(true);
  const { state } = useUser(); 

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = await getAccessTokenSilently();
        const userResponse = await fetch('http://localhost:5001/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();
        
        if (userData.role !== 'admin') {
          throw new Error('Not an admin');
        }
      } catch (error) {
        console.error('Error:', error);
        Navigate('/booking');
      } finally {
        setIsChecking(false);
      }
    };

    checkAdmin();
  }, [getAccessTokenSilently]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (state.adminSaunas.length === 0 && window.location.pathname === '/my-saunas') {
    return <Navigate to="/register-sauna" />;
  }

  return <Outlet />;
};