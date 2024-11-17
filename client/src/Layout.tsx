import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Toaster } from './components/ui/toaster';
import { useEffect, useReducer, useState } from 'react';
import { UserActionType, userReducer, UserState } from './reducers/userReducer';
import { toast } from './hooks/use-toast';
import { UserContext } from './state/userContext';
import Navbar from './components/Navbar';
import { LoadingAnimation } from './components/Loading/Loading';

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
          const adminResponse = await fetch('http://localhost:5001/api/saunas/my-saunas', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!adminResponse.ok) {
            throw new Error('Failed to fetch admin saunas');
          }
          
          const adminSaunas = await adminResponse.json();
          
          dispatchUser({
            type: UserActionType.LOGIN,
            payload: {
              auth0User: user,
              adminSaunas,
              accessibleSaunas: []
            }
          });
        } catch (error) {
          dispatchUser({
            type: UserActionType.LOGIN,
            payload: {
              auth0User: user,
              adminSaunas: [],
              accessibleSaunas: []
            }
          });
          toast({
            title: "Warning",
            description: "Could not fetch saunas. Some features may be limited.",
            variant: "default"
          });
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