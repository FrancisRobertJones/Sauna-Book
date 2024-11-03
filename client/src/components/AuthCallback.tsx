// src/components/Auth0Callback.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth0Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const appState = JSON.parse(localStorage.getItem('appState') || '{}');
      localStorage.removeItem('appState'); 
      
      console.log('AppState in callback:', appState); 

      if (appState.intent === 'register_sauna') {
        navigate('/register-sauna');
      } else {
        navigate('/booking');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default Auth0Callback;