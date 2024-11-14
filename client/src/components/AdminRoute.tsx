import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminRoute = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://localhost:5001/api/saunas/my-saunas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const saunas = await response.json();
        setIsAdmin(saunas.length > 0);
      } catch (error) {
        console.error('Error:', error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdmin();
  }, [getAccessTokenSilently]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/booking" />;
};