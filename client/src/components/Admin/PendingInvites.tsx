import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingInvite } from '@/types/InviteTypes';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/ui/GlowCard';
import { LoadingAnimation } from '@/components/Loading/Loading';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/state/userContext';
import { UserActionType } from '@/reducers/userReducer';
import { apiUrl } from '@/constants/api-url';

export function PendingInvites() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()
  const { dispatch, state } = useUser();

  useEffect(() => {
    const checkInvites = async () => {
      if (!user?.email) return;
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${apiUrl}/api/invite/pending?email=${user.email}`,
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

      const response = await fetch(`${apiUrl}/api/invite/${inviteId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to accept invite');
      }

      const userResponse = await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch updated user data');
      }

      const userData = await userResponse.json();

      const saunaDetailsPromises = userData.saunaAccess.map((saunaId: string) =>
        fetch(`${apiUrl}/api/saunas/${saunaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => (res.ok ? res.json() : null))
      );

      const saunaDetails = await Promise.all(saunaDetailsPromises);
      const validSaunas = saunaDetails.filter((sauna) => sauna !== null);

      dispatch({
        type: UserActionType.UPDATE_ACCESSIBLE_SAUNAS,
        payload: {
          accessibleSaunas: validSaunas
        }
      });

      dispatch({
        type: UserActionType.UPDATE_STATUS,
        payload: {
          status: {
            hasPendingInvites: false,
            isSaunaMember: true
          }
        }
      });

      toast({
        title: "Success!",
        description: "You have successfully accepted the invite.",
        variant: "default",
      });

      setPendingInvites(current =>
        current.filter(invite => invite._id !== inviteId)
      );

      navigate('/booking');

    } catch (err) {
      console.error('Error accepting invite:', err);
      toast({
        title: "Error",
        description: "Failed to accept invite. Please try again.",
        variant: "destructive",
      });
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
            <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
              Pending Invites ({pendingInvites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingInvites.map(invite => (
              <div key={invite._id} className="mb-4 last:mb-0">
                <GlowCard className="bg-muted/50 border-muted-foreground/20">
                  <CardContent className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">
                          {invite.saunaId?.name?.[0] || '?'}
                        </span>
                      </div>
                      <div className="text-center sm:text-left">
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
                      variant={"secondary"}
                      className="w-full sm:w-auto"
                    >
                      Accept Invite
                    </Button>
                  </CardContent>
                </GlowCard>
              </div>
            ))}
          </CardContent>
        </GlowCard>
      </main>
    </div>
  );
}