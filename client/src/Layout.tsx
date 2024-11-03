import { Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Homepage from './pages/Homepage';

const Layout = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <>
      <header className="p-4 flex justify-between items-center">
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <button 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Log Out
            </button>
          </div>
        )}
      </header>
      <main className='max-w-screen-xl w-full p-16 my-0 mx-auto'>
        <Outlet />
      </main>
    </>
  )
};

export default Layout;