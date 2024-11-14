export interface Sauna {
    _id: string;
    name: string;
    adminId: string;
  }
  
  import { useEffect, useState } from 'react';
  import { useAuth0 } from '@auth0/auth0-react';
  
  interface User {
    _id: string;
    email: string;
    name: string;
    saunaAccess: string[];
    role: 'admin' | 'user';
  }
  
  const Booking = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('http://localhost:5001/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const userData = await response.json();
          setUser(userData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [getAccessTokenSilently]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Saunas</h1>
        
        {user && user.saunaAccess.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {user.saunaAccess.map((saunaId) => (
              <div 
                key={saunaId} 
                className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <p>Sauna ID: {saunaId}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You don't have access to any saunas yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Wait for an admin to invite you to their sauna.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  export default Booking;