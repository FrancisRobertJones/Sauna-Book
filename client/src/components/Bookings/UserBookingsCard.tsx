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
import { apiUrl } from "@/constants/api-url"
import { Bell, BellOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";



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
  const [reminderStatuses, setReminderStatuses] = useState<Record<string, boolean>>({});
  const { unbook, isUnbooking } = useUnbook(() => {
    onRefresh();
  });

  const ROLE = "user";

  const toggleReminder = async (bookingId: string) => {
    try {
      const token = await getAccessTokenSilently();

      if (!reminderStatuses[bookingId]) {
        const response = await fetch(`${apiUrl}/api/reminder`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bookingId })
        });

        if (!response.ok) throw new Error('Failed to create reminder');

        setReminderStatuses(prev => ({
          ...prev,
          [bookingId]: true
        }));

        toast({
          title: "Reminder Set",
          description: "You'll receive an email 1 hour before your booking.",
        });
      } else {
        const response = await fetch(`${apiUrl}/api/reminders/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) throw new Error('Failed to delete reminder');

        setReminderStatuses(prev => ({
          ...prev,
          [bookingId]: false
        }));

        toast({
          title: "Reminder Removed",
          description: "Reminder has been cancelled.",
        });
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast({
        title: "Error",
        description: "Failed to update reminder.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchReminderStatuses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const statuses: Record<string, boolean> = {};

        for (const booking of bookings) {
          const response = await fetch(
            `${apiUrl}/api/reminders/booking/${booking._id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (!response.ok) throw new Error('Failed to fetch reminder status');
          const { hasReminder } = await response.json();
          statuses[booking._id] = hasReminder;
        }

        setReminderStatuses(statuses);
      } catch (error) {
        console.error('Error fetching reminder statuses:', error);
      }
    };

    if (bookings.length > 0) {
      fetchReminderStatuses();
    }
  }, [bookings, getAccessTokenSilently]);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${apiUrl}/api/bookings/my-bookings`,
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

                <div className="flex space-x-2 mt-2 self-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReminder(booking._id)}
                          className={reminderStatuses[booking._id] ? 'text-blue-500' : 'text-muted-foreground'}
                        >
                          {reminderStatuses[booking._id] ? (
                            <Bell className="w-4 h-4" />
                          ) : (
                            <BellOff className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {reminderStatuses[booking._id] ? 'Remove Reminder' : 'Set Reminder'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => unbook(booking._id, ROLE)}
                    disabled={isUnbooking === booking._id}
                  >
                    {isUnbooking === booking._id ? 'Cancelling...' : 'Unbook'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </GlowCard>
  )
}
