import { Booking } from '@/types/BookingTypes'
import { DeleteBookingModal } from './DeleteBookingModal'
import { DataTable } from './DataTable'
import { columns } from './Columns'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { UserDetailsResponse } from '@/types/UserTypes'
import { useUnbook } from '@/hooks/use-unbook-sauna-time'
import { toast } from '@/hooks/use-toast'

interface AdminBookingsFormProps {
    allBookings: Booking[]
    setAllBookings: React.Dispatch<React.SetStateAction<Booking[] | undefined>>;
}

export function AdminBookingsForm({ allBookings, setAllBookings }: AdminBookingsFormProps) {
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>(allBookings)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState<UserDetailsResponse | null>(null)
    
    const { getAccessTokenSilently } = useAuth0()
    const { unbook } = useUnbook()
    const ROLE = "admin"

    useEffect(() => {
        setFilteredBookings(allBookings)
    }, [allBookings])

    const fetchUserData = async (bookingId: string) => {
        setIsLoading(true)
        try {
            const token = await getAccessTokenSilently()
            const response = await fetch(
                `http://localhost:5001/api/adminbooking/${bookingId}/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`)
            }

            const data = await response.json()
            setUserData(data)
            return data
        } catch (error) {
            console.error('Error fetching user data:', error)
            toast({
                title: "Error",
                description: "Failed to fetch user data for cancellation.",
                variant: "destructive",
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteClick = async (booking: Booking) => {
        setSelectedBooking(booking)
        try {
            await fetchUserData(booking._id)
            setIsDeleteModalOpen(true)
        } catch (error) {
            setSelectedBooking(null)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedBooking || isLoading || !userData) {
            return
        }

        try {
            await unbook(selectedBooking._id, ROLE, userData._id)
            
            setAllBookings(prevBookings => 
                prevBookings?.filter(booking => booking._id !== selectedBooking._id)
            )
            setFilteredBookings(prevFiltered => 
                prevFiltered.filter(booking => booking._id !== selectedBooking._id)
            )
            
            setIsDeleteModalOpen(false)
            setSelectedBooking(null)
            setUserData(null)
        } catch (error) {
            console.error("Failed to delete booking:", error)
            toast({
                title: "Error",
                description: "Failed to delete booking.",
                variant: "destructive",
            })
        }
    }

    const handleModalClose = () => {
        setIsDeleteModalOpen(false)
        setSelectedBooking(null)
        setUserData(null)
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={filteredBookings}
                onDeleteClick={handleDeleteClick}
            />
            {selectedBooking && (
                <DeleteBookingModal
                    booking={selectedBooking}
                    isOpen={isDeleteModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleDeleteConfirm}
                    isLoading={isLoading}
                    userData={userData}
                />
            )}
        </div>
    )
}