import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"
import { CalendarClock, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { GlowCard } from "../ui/GlowCard"

interface BookingLimitInfoProps {
  userTotalBookings: number
  maxTotalBookings: number
}

export default function BookingLimitInfo({ userTotalBookings, maxTotalBookings }: BookingLimitInfoProps) {
  const bookingsRemaining = maxTotalBookings - userTotalBookings
  const bookingsPercentage = (userTotalBookings / maxTotalBookings) * 100

  return (
    <GlowCard className="w-full max-w-md my-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Booking Limit</CardTitle>
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {userTotalBookings >= maxTotalBookings ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Booking limit reached</AlertTitle>
            <AlertDescription>
              You have reached the maximum limit of {maxTotalBookings} active bookings for this sauna.
              Please wait for some of your current bookings to complete or cancel them before making new ones.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Bookings Used</span>
              <span className="text-sm text-muted-foreground">
                {userTotalBookings} / {maxTotalBookings}
              </span>
            </div>
            <Progress value={bookingsPercentage} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              You have {bookingsRemaining} booking{bookingsRemaining !== 1 ? 's' : ''} remaining.
            </p>
          </>
        )}
      </CardContent>
    </GlowCard>
  )
}
