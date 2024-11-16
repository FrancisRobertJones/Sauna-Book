import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Toaster } from './components/ui/toaster';
import { useEffect, useReducer, useState } from 'react';
import { UserActionType, userReducer, UserState } from './components/reducers/userReducer';
import { toast } from './hooks/use-toast';
import { UserContext } from './components/state/userContext';

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
      await logout({ logoutParams: { returnTo: window.location.origin } });
      dispatchUser({ type: UserActionType.LOGOUT });
      toast({
        title: "You have been logged out!",
        description: "See you next time"
      });
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ state: userState, dispatch: dispatchUser }}>
      <div className="min-h-screen">
        <header className="p-4 flex justify-between items-center">
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span>Welcome, {userState.user?.name}</span>
              {userState.isAdmin && (
                <div className="flex items-center gap-4">
                  <Link
                    to="/my-saunas"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    My Saunas ({userState.adminSaunas.length})
                  </Link>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </header>
        <main className='max-w-screen-xl w-full p-16 my-0 mx-auto'>
          <Outlet />
        </main>
        <Toaster />
      </div>
    </UserContext.Provider>
  );
};

export default Layout;