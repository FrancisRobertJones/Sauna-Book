import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ISauna } from "@/types/SaunaTypes"
import { format, parseISO, addMinutes } from "date-fns"
import { AlertCircle, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react"
import { TimeSlotSelection } from "@/types/BookingTypes"
import { GlowCard } from "../ui/GlowCard"

interface BookingDetailsProps {
  sauna: ISauna;
  selectedDate: Date;
  selectedSlots: TimeSlotSelection | null;
}

export function BookingDetails({
  sauna,
  selectedDate,
  selectedSlots
}: BookingDetailsProps) {
  const canBook = selectedSlots !== null;

  const getTotalDuration = () => {
    if (!selectedSlots) return 0;
    return selectedSlots.numberOfSlots * sauna.slotDurationMinutes;
  };

  const getEndTime = () => {
    if (!selectedSlots) return null;
    const startTime = parseISO(selectedSlots.startSlot);
    return addMinutes(startTime, getTotalDuration());
  };

  const handleBooking = async () => {
    // FJTODO: Implement booking logic
  };

  return (
    <GlowCard>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{sauna.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {sauna.location}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </div>
          {selectedSlots && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {format(parseISO(selectedSlots.startSlot), "h:mm a")} - {format(getEndTime()!, "h:mm a")}
              </div>
              <div className="text-sm text-muted-foreground">
                Duration: {getTotalDuration()} minutes
                {selectedSlots.numberOfSlots > 1 && (
                  <span> ({selectedSlots.numberOfSlots} slots booked)</span>
                )}
              </div>
              {sauna.maxConcurrentBookings > 1 && (
                <div className="text-sm text-muted-foreground">
                  Maximum consecutive slots: {sauna.maxConcurrentBookings}
                </div>
              )}
            </>
          )}
        </div>
        {!canBook && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Please select a time slot to continue
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={!canBook}
          onClick={handleBooking}
        >
          Confirm Booking
        </Button>
      </CardFooter>
    </GlowCard>
  );
}