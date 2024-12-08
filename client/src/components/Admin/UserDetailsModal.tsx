import { Booking } from "@/types/BookingTypes"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useFetchSaunaUsersByBooking } from "@/hooks/use-fetch-sauna-users-by-booking"
import { format } from "date-fns"


interface UserDetailsModalProps {
    booking: Booking
    isOpen: boolean
    onClose: () => void
}

export function UserDetailsModal({ booking, isOpen, onClose }: UserDetailsModalProps) {
    const { user, setUser, isLoading } = useFetchSaunaUsersByBooking(booking._id)


    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'PPP');  

        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <p className="text-sm">Loading user details...</p>
                        </div>
                    ) : user ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <p className="text-sm text-muted-foreground">Name:</p>
                                <p className="text-sm font-medium">{user.name}</p>

                                <p className="text-sm text-muted-foreground">Email:</p>
                                <p className="text-sm font-medium">{user.email}</p>

                                <p className="text-sm text-muted-foreground">Sauna Access:</p>
                                <p className="text-sm font-medium">
                                    {user.saunaAccess.length} locations
                                </p>

                                <p className="text-sm text-muted-foreground">Member Since:</p>
                                <p className="text-sm font-medium">
                                    {formatDate(user.createdAt)}
                                </p>

                                <p className="text-sm text-muted-foreground">Last Updated:</p>
                                <p className="text-sm font-medium">
                                    {formatDate(user.updatedAt)}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-red-500">Failed to load user details.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}