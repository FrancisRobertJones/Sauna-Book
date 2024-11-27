import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { SaunaUser } from './use-fetch-sauna-users'

export function useRemoveSaunaAccess(
  saunaId: string,
  setUsers: React.Dispatch<React.SetStateAction<SaunaUser[]>>
) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const { getAccessTokenSilently } = useAuth0()

  const removeAccess = async (userId: string) => {
    setIsRemoving(true)
    setRemoveError(null)
    
    try {
      const token = await getAccessTokenSilently()
      
      const response = await fetch(
        `http://localhost:5001/api/saunas/${saunaId}/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove user access')
      }

      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
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