// components/PendingInvites.tsx
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingInvite } from '@/types/InviteTypes';


export function PendingInvites() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkInvites = async () => {
      if (!user?.email) return;
      
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `http://localhost:5001/api/invite/pending?email=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const invites = await response.json();
        setPendingInvites(invites);
      } finally {
        setIsLoading(false);
      }
    };

    checkInvites();
  }, [user]);

  const acceptInvite = async (inviteId: string) => {
    const token = await getAccessTokenSilently();
    await fetch(`http://localhost:5001/api/invite/${inviteId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    setPendingInvites(current => 
      current.filter(invite => invite._id !== inviteId)
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (!pendingInvites.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Sauna Invites</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingInvites.map(invite => (
          <div key={invite._id} className="flex justify-between items-center p-4 border-b">
            <div>
              You've been invited to join {invite.saunaId.name}
            </div>
            <button
              onClick={() => acceptInvite(invite._id)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Accept Invite
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}