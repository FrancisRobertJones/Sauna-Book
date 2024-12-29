import { apiUrl } from "@/constants/api-url";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { toast } from "./use-toast";

export const useUnbook = (onUnbookSuccess?: () => void) => {
    const [isUnbooking, setIsUnbooking] = useState<string | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    const checkAndDeleteReminder = async (bookingId: string, token: string) => {
        try {
            const checkResponse = await fetch(`${apiUrl}/api/reminder/booking/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!checkResponse.ok) {
                throw new Error('Failed to check reminder status');
            }

            const { hasReminder } = await checkResponse.json();

            if (hasReminder) {
                const deleteResponse = await fetch(`${apiUrl}/api/reminder/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!deleteResponse.ok) {
                    console.error('Failed to delete reminder');
                }
            }
        } catch (error) {
            console.error('Error handling reminder:', error);
        }
    };

    const unbook = async (bookingId: string, role: string, userId?: string) => {
        let URI = "";
        if (role === "admin") {
            URI = `/adminbooking/${bookingId}/cancel/${userId}`
        } else if (role === "user") {
            URI = `/bookings/${bookingId}/cancel`
        }

        try {
            setIsUnbooking(bookingId);
            const token = await getAccessTokenSilently();
            
            await checkAndDeleteReminder(bookingId, token);

            const response = await fetch(`${apiUrl}/api${URI}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            toast({
                title: "Booking Cancelled",
                description: "Your booking has been successfully cancelled.",
            });

            onUnbookSuccess?.(); 

        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast({
                title: "Error",
                description: "Failed to cancel booking. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUnbooking(null);
        }
    };

    return { unbook, isUnbooking };
};