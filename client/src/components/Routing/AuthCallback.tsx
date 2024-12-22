import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/state/userContext';
import { UserActionType } from '@/reducers/userReducer';
import { LoadingAnimation } from '../Loading/Loading';
import { apiUrl } from '@/constants/api-url';

export const Auth0Callback = () => {
  const { logout, isAuthenticated, isLoading: isAuth0Loading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { dispatch, state } = useUser();
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    if (pendingNavigation && state.accessibleSaunas !== undefined) {
      navigate(pendingNavigation);
    }
  }, [pendingNavigation, state.accessibleSaunas, navigate]);

  useEffect(() => {
    const initializeUser = async () => {
      if (!isAuth0Loading && isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const registerIntent = localStorage.getItem('register_intent');
          const url = new URL(`${apiUrl}/api/users/me`);
          if (registerIntent) {
            url.searchParams.append('register_intent', registerIntent);
            localStorage.removeItem('register_intent');
          }

          const userResponse = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (userResponse.status === 400) {
            await logout({
              logoutParams: {
                returnTo: window.location.origin + '/select-account-type'
              }
            });
            return;
          }

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();

          if (userData.role === 'user' && userData.saunaAccess?.length > 0) {
            const saunaDetailsPromises = userData.saunaAccess.map((saunaId: string) =>
              fetch(`${apiUrl}/api/saunas/${saunaId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then((res) => (res.ok ? res.json() : null))
            );

            const saunaDetails = await Promise.all(saunaDetailsPromises);
            const validSaunas = saunaDetails.filter((sauna) => sauna !== null);

            dispatch({
              type: UserActionType.LOGIN,
              payload: {
                auth0User: userData,
                role: userData.role,
                accessibleSaunas: validSaunas,
                status: {
                  hasPendingInvites: userData.hasPendingInvites,
                  isSaunaMember: validSaunas.length > 0
                }
              }
            });
          } else {
            dispatch({
              type: UserActionType.LOGIN,
              payload: {
                auth0User: userData,
                role: userData.role,
                adminSaunas: userData.role === 'admin' ? [] : undefined,
                accessibleSaunas: [],
                status: {
                  hasPendingInvites: userData.hasPendingInvites,
                  isSaunaMember: false
                }
              }
            });
          }

          if (userData.role === 'admin') {
            setPendingNavigation('/my-saunas');
          } else {
            if (userData.hasPendingInvites) {
              setPendingNavigation('/check-invites');
            } else if (userData.saunaAccess?.length > 0) {
              window.location.href = `${window.location.origin}/booking`
            } else {
              setPendingNavigation('/no-access');
            }
          }
        } catch (error) {
          console.error('Error in Auth0Callback:', error);
          setPendingNavigation('/register-user');
        }
      }
    };

    initializeUser();
  }, [isAuth0Loading, isAuthenticated]);

  return <LoadingAnimation isLoading={true} text="Setting up your account..." />;
};