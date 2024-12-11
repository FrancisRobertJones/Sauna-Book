import { apiUrl } from '@/constants/api-url';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

interface UseWithdrawInviteReturn {
   withdrawInvite: (inviteId: string) => Promise<void>;
   isWithdrawing: boolean;
   error: Error | null;
}

export function useWithdrawInvite(onSuccess?: () => void): UseWithdrawInviteReturn {
   const [isWithdrawing, setIsWithdrawing] = useState(false);
   const [error, setError] = useState<Error | null>(null);
   const { getAccessTokenSilently } = useAuth0();

   const withdrawInvite = async (inviteId: string) => {
       setIsWithdrawing(true);
       setError(null);
       
       try {
           const token = await getAccessTokenSilently();
           const response = await fetch(
               `${apiUrl}/api/invite/${inviteId}`, 
               {
                   method: 'DELETE',
                   headers: {
                       Authorization: `Bearer ${token}`,
                   },
               }
           );

           if (!response.ok) {
               throw new Error('Failed to withdraw invite');
           }

           onSuccess?.();
       } catch (err) {
           setError(err instanceof Error ? err : new Error('Failed to withdraw invite'));
       } finally {
           setIsWithdrawing(false);
       }
   };

   return { withdrawInvite, isWithdrawing, error };
}
