// client/src/components/TestAuth.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const TestAuth = () => {
  const { getAccessTokenSilently, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:5001/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch user data');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Auth Test</h2>
      
      {!isAuthenticated ? (
        <button 
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-bold">Auth0 User:</h3>
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <button 
            onClick={fetchUserData}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Fetch User Data from Backend
          </button>

          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          {userData && (
            <div>
              <h3 className="font-bold">Backend User Data:</h3>
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestAuth;