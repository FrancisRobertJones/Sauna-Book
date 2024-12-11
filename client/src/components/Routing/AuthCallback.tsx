import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/state/userContext';
import { UserActionType } from '@/reducers/userReducer';
import { LoadingAnimation } from '../Loading/Loading';
import { apiUrl } from '@/constants/api-url';

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading: isAuth0Loading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { dispatch } = useUser();

  useEffect(() => {
    const initializeUser = async () => {
      console.log('InitializeUser called')
      if (!isAuth0Loading && isAuthenticated) {
        console.log('User authenticated, fetching token')
        try {
          const token = await getAccessTokenSilently();
          console.log('Token received');
          const registerIntent = localStorage.getItem('register_intent');
          const url = new URL(`${apiUrl}/api/users/me`);
          console.log('Fetching from URL:', url.toString()); 

          if (registerIntent) {
            url.searchParams.append('register_intent', registerIntent);
            localStorage.removeItem('register_intent');
          }
  
          const userResponse = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('User response status:', userResponse.status); 

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();
          console.log('User data received:', { role: userData.role }); 

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
  console.log('Rendering callback with loading:', isAuth0Loading);


  if (isAuth0Loading) {
    return <LoadingAnimation isLoading={true} text="Loading..." />;
  }

  return <LoadingAnimation isLoading={true} text="Redirecting..." />;
};