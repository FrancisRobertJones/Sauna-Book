import { useAuth0 } from "@auth0/auth0-react";
import { LoadingAnimation } from "../Loading/Loading";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/state/userContext";
import { useEffect, useState } from "react";
import { apiUrl } from "@/constants/api-url";

export const UnauthedProtected = () => {
  const { logout, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { state } = useUser();
  const location = useLocation();
  const [isStateInitialized, setIsStateInitialized] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);

  const intent = localStorage.getItem('register_intent');

  useEffect(() => {
    if (state.user || !isAuthenticated) {
      setIsStateInitialized(true);
    }
  }, [state, isAuthenticated]);

  useEffect(() => {
    const checkUserExists = async () => {
      if (isAuthenticated && isStateInitialized && !state.role) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${apiUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsExistingUser(response.ok);
        } catch (error) {
          setIsExistingUser(false);
        }
      }
    };

    checkUserExists();
  }, [isAuthenticated, isStateInitialized, state.role]);

  useEffect(() => {
    const handleNoRole = async () => {
      if (isExistingUser === false && !intent) { 
        await logout({
          logoutParams: {
            returnTo: window.location.origin + '/select-account-type'
          }
        });
      }
    };
  
    handleNoRole();
  }, [isExistingUser, intent, logout]);






  if (isLoading || (!isStateInitialized && isAuthenticated)) {
    return <LoadingAnimation isLoading={true} text="Loading.." />;
  }


  console.log(state, "this is the user state")
  if (isLoading) {
    return <LoadingAnimation isLoading={isLoading} text="Loading.." />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (!state.role) {
    return <LoadingAnimation isLoading={true} text="Loading user data.." />;
  }

  if (state.role === 'admin') {
    return <Navigate to="/my-saunas" state={{ from: location }} replace />;
  }

  if (state.status.hasPendingInvites) {
    return <Navigate to="/check-invites" state={{ from: location }} replace />;
  }

  if (state.status.isSaunaMember) {
    return <Navigate to="/booking" state={{ from: location }} replace />;
  }

  return <Navigate to="/no-access" state={{ from: location }} replace />;
};