import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/state/userContext';
import { UserActionType } from '@/reducers/userReducer';
import { LoadingAnimation } from '../Loading/Loading';

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading: isAuth0Loading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { dispatch } = useUser();

  useEffect(() => {
    const initializeUser = async () => {
      if (!isAuth0Loading && isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const registerIntent = localStorage.getItem('register_intent');
          const url = new URL('http://localhost:5001/api/users/me');
          
          if (registerIntent) {
            url.searchParams.append('register_intent', registerIntent);
            localStorage.removeItem('register_intent');
          }
  
          const userResponse = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();
          
          dispatch({
            type: UserActionType.LOGIN,
            payload: {
              auth0User: userData,
              role: userData.role,
              adminSaunas: userData.role === 'admin' ? [] : undefined,
              accessibleSaunas: userData.role === 'user' ? userData.saunaAccess : [],
              status: {
                hasPendingInvites: userData.hasPendingInvites,
                isSaunaMember: userData.saunaAccess?.length > 0
              }
            }
          });

          if (userData.role === 'admin') {
            navigate('/my-saunas');
          } else {
            if (userData.hasPendingInvites) {
              navigate('/check-invites');
            } else if (userData.saunaAccess?.length > 0) {
              navigate('/booking');
            } else {
              navigate('/no-access');
            }
          }
        } catch (error) {
          console.error('Error in Auth0Callback:', error);
          navigate('/register-user');
        }
      }
    };

    initializeUser();
  }, [isAuth0Loading, isAuthenticated]);

  if (isAuth0Loading) {
    return <LoadingAnimation isLoading={true} text="Loading..." />;
  }

  return <LoadingAnimation isLoading={true} text="Redirecting..." />;
};