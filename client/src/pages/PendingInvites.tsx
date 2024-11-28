import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingInvite } from '@/types/InviteTypes';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/ui/GlowCard';
import { LoadingAnimation } from '@/components/Loading/Loading';

export function PendingInvites() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (!response.ok) {
          throw new Error('Failed to fetch invites');
        }

        const invites = await response.json();
        console.log('Received invites:', invites); 
        setPendingInvites(invites);
      } catch (err) {
        console.error('Error fetching invites:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invites');
      } finally {
        setIsLoading(false);
      }
    };

    checkInvites();
  }, [user]);

  const acceptInvite = async (inviteId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:5001/api/invite/${inviteId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to accept invite');
      }

      setPendingInvites(current =>
        current.filter(invite => invite._id !== inviteId)
      );
    } catch (err) {
      console.error('Error accepting invite:', err);
    }
  };

  if (isLoading) return <LoadingAnimation isLoading={true} text="Loading invites..." />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!pendingInvites.length) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 backdrop-blur-sm border-b border-muted-foreground/20">
        <h1 className="text-3xl font-bold text-center">Sauna Invitations</h1>
      </header>
      <main className="flex-grow flex items-start justify-center pt-12 px-4">
        <GlowCard className="w-full max-w-2xl bg-background/80 backdrop-blur-sm border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Pending Invites ({pendingInvites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingInvites.map(invite => (
              <div key={invite._id} className="mb-4 last:mb-0">
                <Card className="bg-muted/50 border-muted-foreground/20">
                  <CardContent className="flex justify-between items-center p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {invite.saunaId?.name?.[0] || '?'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {invite.saunaId?.name || 'Unknown Sauna'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          You've been invited to join this sauna
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => acceptInvite(invite._id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                    >
                      Accept Invite
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </CardContent>
        </GlowCard>
      </main>
    </div>
  );
}