import { useAuth0 } from "@auth0/auth0-react";
import { LoadingAnimation } from "../Loading/Loading";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/state/userContext";
import { useEffect, useState } from "react";

export const UnauthedProtected = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const { state } = useUser();
    const location = useLocation();
    const [isStateInitialized, setIsStateInitialized] = useState(false);


    useEffect(() => {
      if (state.user || !isAuthenticated) {
        setIsStateInitialized(true);
      }
    }, [state, isAuthenticated]);
  
    if (isLoading || (!isStateInitialized && isAuthenticated)) {
      return <LoadingAnimation isLoading={true} text="Loading.." />;
    }

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