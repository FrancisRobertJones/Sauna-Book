import { useAuth0, User as Auth0User } from '@auth0/auth0-react';
import { useState } from 'react';
import { useUser } from '../state/userContext';
import { IUserAction, UserActionType } from '@/reducers/userReducer';
import { apiUrl } from '@/constants/api-url';

export const useUserStatus = () => {
    const { getAccessTokenSilently, user: auth0User } = useAuth0();
    const { state, dispatch } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        
        const response = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user status');
        }
  
        const data = await response.json();
        
        const dispatchPayload: IUserAction = {
          type: UserActionType.LOGIN,
          payload: {
            auth0User: auth0User as Auth0User, 
            role: data.role,
            adminSaunas: data.role === 'admin' ? data.adminSaunas : [],
            accessibleSaunas: data.role === 'user' ? data.accessibleSaunas : [],
            status: {
              hasPendingInvites: data.hasPendingInvites,
              isSaunaMember: data.isSaunaMember
            }
          }
        };
  
        dispatch(dispatchPayload);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
  
    return {
      isLoading,
      error,
      role: state.role,
      status: state.status,
      checkUserStatus
    };
  };