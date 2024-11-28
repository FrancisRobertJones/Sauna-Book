import { useAuth0 } from "@auth0/auth0-react";
import { LoadingAnimation } from "./Loading/Loading";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/state/userContext";

export const UnauthedProtected = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const { state } = useUser();
    const location = useLocation();
  
    if (isLoading) {
      return <LoadingAnimation isLoading={isLoading} text="Loading.." />;
    }
  
    if (!isAuthenticated) {
      return <Outlet />;
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