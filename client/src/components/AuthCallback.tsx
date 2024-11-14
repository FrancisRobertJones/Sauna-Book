import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Auth0Callback = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('http://localhost:5001/api/saunas/my-saunas', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const saunas = await response.json();
          
          if (saunas.length > 0) {
            navigate('/my-saunas');
          } else {
            navigate('/booking');
          }
        } catch (error) {
          console.error('Error:', error);
          navigate('/booking'); 
        }
      }
    };

    checkUserRole();
  }, [isAuthenticated, isLoading]);

  return <div>Loading...</div>;
};