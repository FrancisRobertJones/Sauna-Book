import { Booking } from '@/types/BookingTypes'
import { DeleteBookingModal } from './DeleteBookingModal'
import { DataTable } from './DataTable'
import { columns } from './Columns'
import { useEffect, useState } from 'react'


interface AdminBookingsFormProps {
    allBookings: Booking[]
    onDeleteBooking: (bookingId: string) => Promise<void>
}

export function AdminBookingsForm({ allBookings, onDeleteBooking }: AdminBookingsFormProps) {
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>(allBookings)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


    const handleDeleteClick = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (selectedBooking) {
            await onDeleteBooking(selectedBooking._id)
            setFilteredBookings(filteredBookings.filter(b => b._id !== selectedBooking._id))
            setIsDeleteModalOpen(false)
            setSelectedBooking(null)
        }
    }

    useEffect(() => {console.log(allBookings, + ">>>>>> this si the bookigns") }, [allBookings])

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
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    )
}