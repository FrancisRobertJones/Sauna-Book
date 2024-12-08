import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Booking } from '@/types/BookingTypes'
import { UserResponse } from '@/types/UserTypes'


interface DeleteBookingModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteBookingModal({ booking, isOpen, onClose, onConfirm }: DeleteBookingModalProps) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

/*   useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      fetchUserDetails(booking.userId)
        .then(setUser)
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [isOpen, booking.userId])
 */
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h3 className="font-semibold">Booking Details</h3>
          <p>Booking ID: {booking._id}</p>
          <p>Sauna ID: {booking.saunaId}</p>
          <p>Start Time: {new Date(booking.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(booking.endTime).toLocaleString()}</p>
          <p>Status: {booking.status}</p>

          <h3 className="font-semibold mt-4">User Details</h3>
          {isLoading ? (
            <p>Loading user details...</p>
          ) : user ? (
            <>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Sauna Access: {user.saunaAccess.join(', ')}</p>
              <p>Is Sauna Member: {user.status.isSaunaMember ? 'Yes' : 'No'}</p>
              <p>Has Pending Invites: {user.status.hasPendingInvites ? 'Yes' : 'No'}</p>
            </>
          ) : (
            <p>Failed to load user details.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Delete Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

