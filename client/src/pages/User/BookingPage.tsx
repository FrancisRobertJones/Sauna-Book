import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "../../components/Bookings/TimeSlotPicker"
import { BookingDetails } from "../../components/Bookings/BookingDetails"
import { ISauna } from "@/types/SaunaTypes"
import { LoadingAnimation } from "@/components/Loading/Loading"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Booking, TimeSlotSelection } from "@/types/BookingTypes"
import { GlowCard } from "@/components/ui/GlowCard"

import { BookingSaunaTitle } from "@/components/Bookings/BookingSaunaTitle"
import { BookingCard } from "@/components/Bookings/UserBookingsCard"
import { apiUrl } from "@/constants/api-url"

export default function BookingPage() {
  const { saunaId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [sauna, setSauna] = useState<ISauna | null>(null);
  const [isSaunaLoading, setSaunaLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<TimeSlotSelection | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [refreshKey, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  useEffect(() => {
    setSelectedSlots(null);
  }, [refreshKey])



  useEffect(() => {
    const fetchSauna = async () => {
      try {
        setSaunaLoading(true);
        const token = await getAccessTokenSilently();
        const saunaResponse = await fetch(`${apiUrl}/api/saunas/${saunaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!saunaResponse.ok) {
          throw new Error('Failed to fetch sauna details');
        }
        const saunaData = await saunaResponse.json();
        setSauna(saunaData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setSaunaLoading(false);
      }
    };

    if (saunaId) {
      fetchSauna();
    }
  }, [saunaId, getAccessTokenSilently, refreshKey]);



  useEffect(() => {
    const fetchAllUserBookings = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${apiUrl}/api/bookings/my-bookings`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const bookings = await response.json();
        setUserBookings(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load your bookings"
        });
      } finally {
      }
    };

    if (saunaId && !isSaunaLoading) {
      fetchAllUserBookings();
    }
  }, [saunaId, isSaunaLoading, getAccessTokenSilently, refreshKey]);

  if (isSaunaLoading) {
    return <LoadingAnimation isLoading={isSaunaLoading} text="Loading sauna details..." />;
  }

  if (!sauna) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-lg text-muted-foreground">
            Could not find the requested sauna.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlowCard className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-8">
              <div className="w-full lg:w-auto">
                <BookingSaunaTitle
                  title={sauna.name}
                />
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    const startOfDay = new Date(newDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    setDate(startOfDay);
                  }
                }}
                className="rounded-md border w-full max-w-sm mx-auto"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </GlowCard>
          <TimeSlotPicker
            key={refreshKey}
            sauna={sauna}
            selectedDate={date}
            selectedSlots={selectedSlots}
            onSlotsSelect={setSelectedSlots}
          />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <BookingDetails
            sauna={sauna}
            selectedDate={date}
            selectedSlots={selectedSlots}
            handleRefresh={handleRefresh}
          />
          {userBookings.length > 0 && saunaId && (
            <BookingCard
              userBookings={userBookings}
              currentSaunaId={saunaId}
              name={sauna.name}
              onRefresh={handleRefresh}
              refreshTrigger={refreshKey}
            />
          )}
        </div>
      </div>
    </div>
  );
}