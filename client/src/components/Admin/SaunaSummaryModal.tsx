import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { SaunaFormValues } from "@/types/FormValues"
  
  interface SaunaSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: SaunaFormValues;
  }
  
  export function SaunaSummaryModal({ isOpen, onClose, onConfirm, data }: SaunaSummaryModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sauna Registration Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span>{data.name}</span>
                <span className="text-muted-foreground">Location:</span>
                <span>{data.location || 'Not specified'}</span>
                <span className="text-muted-foreground">Description:</span>
                <span>{data.description || 'Not specified'}</span>
              </div>
            </div>
  
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Booking Settings</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Slot Duration:</span>
                <span>{data.slotDurationMinutes} minutes</span>
                <span className="text-muted-foreground">Max Concurrent:</span>
                <span>{data.maxConcurrentBookings} bookings</span>
                <span className="text-muted-foreground">Max Total:</span>
                <span>{data.maxTotalBookings} bookings</span>
              </div>
            </div>
  
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Operating Hours</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Weekday:</span>
                <span>{data.operatingHours.weekday.start} - {data.operatingHours.weekday.end}</span>
                <span className="text-muted-foreground">Weekend:</span>
                <span>{data.operatingHours.weekend.start} - {data.operatingHours.weekend.end}</span>
              </div>
            </div>
          </div>
  
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Back to Edit
            </Button>
            <Button onClick={onConfirm}>
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  