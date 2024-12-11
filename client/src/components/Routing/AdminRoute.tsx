import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useReducer, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '@/state/userContext';
import { UserActionType } from '@/reducers/userReducer';
import { LoadingAnimation } from '../Loading/Loading';
import { apiUrl } from '@/constants/api-url';

export const AdminRoute = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { dispatch, state } = useUser();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = await getAccessTokenSilently();

        const userResponse = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = await userResponse.json();
        if (userData.role !== 'admin') {
          navigate('/booking');
          return;
        }

        const saunasResponse = await fetch(`${apiUrl}/api/saunas/admin-saunas`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const adminSaunas = await saunasResponse.json();
        dispatch({
          type: UserActionType.UPDATE_ADMIN_SAUNAS,
          payload: {
            adminSaunas: adminSaunas,
            role: state.role || 'admin',
            status: state.status,
            auth0User: state.user?.auth0Id ? {
              sub: state.user.auth0Id,
              email: state.user.email,
              name: state.user.name
            } : undefined,
            accessibleSaunas: state.accessibleSaunas
          }
        });

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
    return <LoadingAnimation
      text={'Checking for saunas'}
      isLoading={isChecking}
    />
  }

  return <Outlet />;
};