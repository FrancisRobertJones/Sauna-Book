import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Booking } from '@/types/BookingTypes'
import { UserDetailsResponse } from '@/types/UserTypes'

interface DeleteBookingModalProps {
  booking: Booking
  userData: UserDetailsResponse | null
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteBookingModal({ 
  booking, 
  userData, 
  isOpen, 
  isLoading, 
  onClose, 
  onConfirm 
}: DeleteBookingModalProps) {
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
          <p>Start Time: {new Date(booking.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(booking.endTime).toLocaleString()}</p>
          <h3 className="font-semibold mt-4">User Details</h3>
          {isLoading ? (
            <p>Loading user details...</p>
          ) : userData ? (
            <>
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
            </>
          ) : (
            <p>Failed to load user details.</p>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading || !userData}
          >
            {isLoading ? "Loading..." : "Delete Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}