import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export type SaunaUser = {
    _id: string
    name: string
    email: string
}

export function useFetchSaunaUsers(saunaId: string) {
    const [users, setUsers] = useState<SaunaUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const token = await getAccessTokenSilently()

                console.log(saunaId + " SAUNA ID IS>>>>>")
                const response = await fetch(`http://localhost:5001/api/saunas/${saunaId}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    const errorData = await response.json(); 
                    console.error('Response error:', errorData);
                    throw new Error(errorData.message || 'Failed to fetch users');
                  }

                const data = await response.json()
                setUsers(data)
                setError(null)
            } catch (err) {
                setError('Failed to fetch sauna users')
                console.error('Error fetching sauna users:', err)
            } finally {
                setIsLoading(false)
            }
        }

        if (saunaId) {
            fetchUsers()
        }
    }, [saunaId, getAccessTokenSilently])

    return { users, setUsers, isLoading, error }

}