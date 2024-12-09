import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Booking } from "@/types/BookingTypes"
import { format } from "date-fns"
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { GlowCard } from "../ui/GlowCard"
import { useUnbook } from "@/hooks/use-unbook-sauna-time"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "@/hooks/use-toast"


interface BookingCardProps {
  userBookings: Booking[]
  currentSaunaId: string,
  name: string,
  onRefresh: () => void;
  refreshTrigger: number;
}

export function BookingCard({ userBookings: initialBookings, currentSaunaId, onRefresh, refreshTrigger, name }: BookingCardProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const { getAccessTokenSilently } = useAuth0();
  const { unbook, isUnbooking } = useUnbook(() => {
    onRefresh();
  });

  const ROLE = "user";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          'http://localhost:5001/api/bookings/my-bookings',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch bookings');
        const newBookings: Booking[] = await response.json();
        setBookings(newBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to refresh bookings.",
          variant: "destructive",
        });
      }
    };

    fetchBookings();
  }, [currentSaunaId, getAccessTokenSilently, refreshTrigger, refreshTrigger]);

  return (
    <GlowCard className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-center text-muted-foreground">No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="flex flex-col space-y-2 p-4 rounded-lg bg-secondary/50 transition-all hover:bg-secondary/70"
              >
                <div className="flex items-center space-x-2 text-primary">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-medium">
                    {format(new Date(booking.startTime), "EEE, MMM d")}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {format(new Date(booking.startTime), "h:mm a")} -{" "}
                    {format(new Date(booking.endTime), "h:mm a")}
                  </span>
                </div>
                {booking.saunaId !== currentSaunaId && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">At: {name}</span>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => unbook(booking._id, ROLE)}
                  disabled={isUnbooking === booking._id}
                  className="mt-2 self-end"
                >
                  {isUnbooking === booking._id ? 'Cancelling...' : 'Unbook'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </GlowCard>
  )
}
