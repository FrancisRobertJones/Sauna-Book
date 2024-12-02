import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ISauna } from "@/types/SaunaTypes"
import { format } from "date-fns"
import { AlertCircle, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react"


interface BookingDetailsProps {
  sauna: ISauna
  selectedDate: Date
  selectedTimeSlot: string | null
}

export function BookingDetails({ sauna, selectedDate, selectedTimeSlot }: BookingDetailsProps) {
  const canBook = selectedTimeSlot !== null

  return (
    <Card>
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
          {selectedTimeSlot && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {selectedTimeSlot} ({sauna.slotDurationMinutes} minutes)
            </div>
          )}
        </div>
        {!canBook && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Please select a time slot to continue
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!canBook}>
          Confirm Booking
        </Button>
      </CardFooter>
    </Card>
  )
}

