import React from 'react'

import { useAuth0 } from '@auth0/auth0-react';

const Homepage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleNormalLogin = () => {
    localStorage.removeItem('register_intent'); 
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`
      }
    });
  };

  const handleRegisterSauna = () => {
    localStorage.setItem('register_intent', 'true');
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-8">Sauna Booking System</h1>

      <div className="space-y-4">
        <button
          onClick={handleNormalLogin}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Login to Book
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleRegisterSauna}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Register Your Sauna
        </button>
      </div>
    </div>
  );
};

export default Homepage;
