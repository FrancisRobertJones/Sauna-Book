import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { SaunaUserStats } from '@/types/UserTypes'
import { toast } from './use-toast'
import { apiUrl } from '@/constants/api-url';

export function useFetchSaunaUsersBySauna(saunaId: string) {
    const [users, setUsers] = useState<SaunaUserStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(
                    `${apiUrl}/api/adminbooking/sauna/${saunaId}/users`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
    
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                console.log(data, "HERE ARE THE USERS")
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast({
                    title: "Error",
                    description: "Failed to load user data.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchUsers();
    }, [saunaId, getAccessTokenSilently]);

    return { users, setUsers, isLoading }

}
