import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const isRegistering = localStorage.getItem('register_intent') === 'true';
      localStorage.removeItem('register_intent');
      
      if (isRegistering) {
        navigate('/register-sauna');
      } else {
        navigate('/booking');
      }
    }
  }, [isAuthenticated, isLoading]);

  return <div>Loading...</div>;
};
