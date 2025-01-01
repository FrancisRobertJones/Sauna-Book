import { apiUrl } from '@/constants/api-url';
import { useAuth0 } from '@auth0/auth0-react';

export const useWaitlist = () => {
    const { getAccessTokenSilently } = useAuth0();

    const addToWaitlist = async (saunaId: string, slotTime: string | Date, bookingId: string) => {
        const token = await getAccessTokenSilently();
        const formattedSlotTime = slotTime instanceof Date ? slotTime.toISOString() : slotTime;
        
        const response = await fetch(`${apiUrl}/api/waitlist/${saunaId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                slotTime: formattedSlotTime,
                bookingId 
            }),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to join waitlist');
        }
    
        return response.json();
    };
    const removeFromWaitlist = async (saunaId: string, slotTime: Date) => {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${apiUrl}/api/waitlist/${saunaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slotTime }),
        });

        if (!response.ok) {
            throw new Error('Failed to remove from waitlist');
        }
    };

    const fetchWaitlistStatus = async (saunaId: string) => {
        const token = await getAccessTokenSilently();
        try {
            const response = await fetch(`${apiUrl}/api/waitlist/${saunaId}/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch waitlist status');
            }
    
            console.log(data, "here is the position data")
            return data;
        } catch (error) {
            throw error;
        }
    };

    return {
        addToWaitlist,
        removeFromWaitlist,
        fetchWaitlistStatus,
    };
};