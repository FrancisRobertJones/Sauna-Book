import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Toaster } from './components/ui/toaster';
import { useEffect, useReducer, useState } from 'react';
import { UserActionType, IUserAction, userReducer, UserState } from './reducers/userReducer';
import { toast } from './hooks/use-toast';
import { UserContext } from './state/userContext';
import { LoadingAnimation } from './components/Loading/Loading';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { ISauna } from './types/SaunaTypes';
import Navbar from './components/Navbar/Navbar';
import { apiUrl } from './constants/api-url';

const Layout = () => {
  const navigate = useNavigate();
  const { logout, getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [userState, dispatchUser] = useReducer(userReducer, new UserState());
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const initializeUser = async () => {
      console.log('Initializing user:', { isAuthenticated, user });

      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const registerIntent = localStorage.getItem('register_intent');          
          const url = new URL(`${apiUrl}/api/users/me`);
          if (registerIntent) {
            url.searchParams.append('register_intent', registerIntent);
          }
    
          const userResponse = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }
    
          const userData = await userResponse.json();
          const role = userData.role;
    
          let saunas: ISauna[] = [];
          if (role === 'admin') {
            const adminSaunasResponse = await fetch(`${apiUrl}/api/saunas/admin-saunas`, {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            if (adminSaunasResponse.ok) {
              saunas = await adminSaunasResponse.json();            
            }

          } else if (role === 'user') {
            const saunaAccessIds: string[] = userData.saunaAccess;
            const saunaDetailsPromises = saunaAccessIds.map((saunaId) =>
              fetch(`${apiUrl}/api/saunas/${saunaId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then((res) => (res.ok ? res.json() : null))
            );
    
            const saunaDetails = await Promise.all(saunaDetailsPromises);
            saunas = saunaDetails.filter((sauna) => sauna !== null); 
          }

          console.log('About to dispatch user data:', {
            role: userData.role,
            saunasCount: saunas.length
          });

          const dispatchPayload: IUserAction = {
            type: UserActionType.LOGIN,
            payload: {
              auth0User: user,
              name: userData.name,
              role: userData.role,
              adminSaunas: role === 'admin' ? saunas : [],
              accessibleSaunas: role === 'user' ? saunas : [],
              status: {
                hasPendingInvites: userData.status.hasPendingInvites,
                isSaunaMember: userData.status.isSaunaMember
              }
            }
          };

          dispatchUser(dispatchPayload);

        } catch (error) {
          console.error('Layout - Error:', error);
          toast({
            title: "Warning",
            description: "Could not fetch user data. Some features may be limited.",
            variant: "default"
          });

          const fallbackPayload: IUserAction = {
            type: UserActionType.LOGIN,
            payload: {
              auth0User: user,
              role: 'user',
              adminSaunas: [],
              accessibleSaunas: [],
              status: {
                hasPendingInvites: false,
                isSaunaMember: false
              }
            }
          };
          dispatchUser(fallbackPayload);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const handleLogout = async () => {
    try {
      await logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
      dispatchUser({ type: UserActionType.LOGOUT });
      navigate('/');
    } catch (error) {
      toast({
        title: "There has been an error!"
      });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <LoadingAnimation
        isLoading={isLoading}
        text='Loading..' />
    );
  }

  return (
    <UserContext.Provider value={{ state: userState, dispatch: dispatchUser }}>
      <div className="min-h-screen flex flex-col">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar
            userState={userState}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
          <main className='w-full py-8 sm:py-12 lg:py-16'>
            <AnimatedBackground />
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        <Toaster />
      </div>
    </UserContext.Provider>
  );
};

export default Layout;