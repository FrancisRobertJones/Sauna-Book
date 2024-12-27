import { useState } from 'react'
import { useUser } from '@/state/userContext'
import { UserActionType } from '@/reducers/userReducer'
import { useAuth0 } from '@auth0/auth0-react'
import { apiUrl } from '@/constants/api-url'

export const useDeleteAccount = () => {
  const { dispatch } = useUser()
  const { logout } = useAuth0()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getAccessTokenSilently } = useAuth0();

  const deleteAccount = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiUrl}/api/users/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      dispatch({ type: UserActionType.DELETE_USER })

      logout({ logoutParams: { returnTo: window.location.origin } })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteAccount, isDeleting, error }
}