import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Toaster } from './components/ui/toaster';
import { useEffect, useReducer, useState } from 'react';
import { UserActionType, userReducer, UserState } from './reducers/userReducer';
import { toast } from './hooks/use-toast';
import { UserContext } from './state/userContext';
import Navbar from './components/Navbar';
import { LoadingAnimation } from './components/Loading/Loading';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { IUserAction, UserResponse } from './types/UserTypes';
import { Sauna } from './pages/Booking';

const Layout = () => {
  const navigate = useNavigate();
  const { logout, getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [userState, dispatchUser] = useReducer(userReducer, new UserState());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const userResponse = await fetch('http://localhost:5001/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
  
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const userData = await userResponse.json() as UserResponse;
          console.log('Layout - User Data:', userData);
  
          const role = userData.role;
          let adminSaunas: Sauna[] = [];
  
          if (role === 'admin') {
            const adminResponse = await fetch('http://localhost:5001/api/saunas/my-saunas', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (adminResponse.ok) {
              adminSaunas = await adminResponse.json();
            }
          }
  
          const dispatchPayload: IUserAction = {
            type: UserActionType.LOGIN,
            payload: {
              auth0User: user,
              role: userData.role,
              adminSaunas: adminSaunas,
              accessibleSaunas: [],
              status: {
                hasPendingInvites: userData.status.hasPendingInvites,
                isSaunaMember: userData.status.isSaunaMember
              }
            }
          };
          
          dispatchUser(dispatchPayload);
  
          console.log('Layout - Dispatching payload:', dispatchPayload);
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
      isLoading = {isLoading}
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