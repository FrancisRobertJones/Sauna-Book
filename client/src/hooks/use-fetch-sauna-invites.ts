import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export interface Invite {
  _id: string;
  email: string;
  saunaId: string;
  status: 'pending' | 'accepted' | 'rejected';
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export function useSaunaInvites(saunaId: string) {
  const [invites, setInvites] = useState<Invite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    async function fetchInvites() {
      try {
        const token = await getAccessTokenSilently()
        const response = await fetch(`http://localhost:5001/api/invite/sauna/${saunaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch sauna invites')
        }
        const data = await response.json()
        setInvites(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
        setIsLoading(false)
      }
    }

    fetchInvites()
  }, [saunaId, getAccessTokenSilently])

  return { invites, isLoading, error }
}

