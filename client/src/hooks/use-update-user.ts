import { apiUrl } from "@/constants/api-url"
import { UserActionType } from "@/reducers/userReducer"
import { useUser } from "@/state/userContext"
import { useAuth0 } from "@auth0/auth0-react"
import { useState } from "react"

export const useUpdateProfile = () => {
    const { dispatch } = useUser() 
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { getAccessTokenSilently } = useAuth0();

    const updateProfile = async (newName: string) => {
        const token = await getAccessTokenSilently();

        setIsUpdating(true)
        setError(null)

        try {
            console.log(newName + "is")
            const response = await fetch(`${apiUrl}/api/users/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName }),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            const updatedUser = await response.json()

            dispatch({
                type: UserActionType.UPDATE_USER,
                payload: { name: newName }
            })

            return updatedUser
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile')
            throw err
        } finally {
            setIsUpdating(false)
        }
    }

    return { updateProfile, isUpdating, error }
}
