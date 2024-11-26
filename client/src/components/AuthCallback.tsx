import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingAnimation } from "./Loading/Loading";

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const isRegistering = localStorage.getItem('register_intent') === 'true';
      const isManaging = localStorage.getItem('register_intent-manage') === 'true';
      localStorage.removeItem('register_intent');
      localStorage.removeItem('register_intent-manage');

      if (isRegistering) {
        navigate('/register-sauna');
      } if(isManaging) {
        navigate('/my-saunas');
      }else {
        navigate('/booking');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <LoadingAnimation
    isLoading = {isLoading}
    text='Loading..' />
  );;
};
