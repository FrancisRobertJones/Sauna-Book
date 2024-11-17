import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AdminRoute = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

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
        console.log('User data:', userData);

        if (userData.role !== 'admin') {
          navigate('/booking');
          return;
        }

        const saunasResponse = await fetch('http://localhost:5001/api/saunas/my-saunas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const adminSaunas = await saunasResponse.json();
        console.log('Admin saunas:', adminSaunas);

        if (window.location.pathname === '/my-saunas' && adminSaunas.length === 0) {
          navigate('/register-sauna');
          return;
        }

      } catch (error) {
        console.error('AdminRoute error:', error);
        navigate('/booking');
      } finally {
        setIsChecking(false);
      }
    };

    checkAdmin();
  }, [getAccessTokenSilently, navigate]);

  if (isChecking) {
    return <div>Checking permissions...</div>;
  }

  return <Outlet />;
};