import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { UserDetailsResponse } from '@/types/UserTypes'
import { toast } from './use-toast'
import { apiUrl } from '@/constants/api-url';

export function useFetchSaunaUsersByBooking(bookingId: string) {
    const [user, setUser] = useState<UserDetailsResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    
    useEffect(() => {
        const fetchUsers = async () => {
            if (!bookingId) {
                setIsLoading(false);
                return;
            }

            try {
                const token = await getAccessTokenSilently();
                
                const response = await fetch(
                    `${apiUrl}/api/adminbooking/${bookingId}/user`,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Response not ok:', errorText);
                    throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error in fetchUsers:', error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load user data.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchUsers();
    }, [bookingId, getAccessTokenSilently]);

    return { user, setUser, isLoading }
}