import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { SaunaUserStats } from '@/types/UserTypes'
import { apiUrl } from '@/constants/api-url'

export function useRemoveSaunaAccess(
  saunaId: string,
  setUsers: React.Dispatch<React.SetStateAction<SaunaUserStats[]>>
) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const { getAccessTokenSilently } = useAuth0()

  const removeAccess = async (userId: string) => {
    setIsRemoving(true)
    setRemoveError(null)

    try {
      const token = await getAccessTokenSilently()
      const encodedUserId = encodeURIComponent(userId)

      const response = await fetch(
        `${apiUrl}/api/adminbooking/sauna/${saunaId}/users/${encodedUserId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to remove user access')
      }

      const refreshResponse = await fetch(
        `${apiUrl}/api/adminbooking/sauna/${saunaId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!refreshResponse.ok) throw new Error('Failed to refresh users');
      const freshUsers = await refreshResponse.json();
      setUsers(freshUsers);

    } catch (err) {
      console.error('Error removing user access:', err)
      setRemoveError('Failed to remove user access')
      throw err
    } finally {
      setIsRemoving(false)
    }
  }
  return { removeAccess, isRemoving, removeError }
}