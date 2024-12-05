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

export default function BookingPage() {
  const { saunaId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [sauna, setSauna] = useState<ISauna | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<TimeSlotSelection | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [refreshKey, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessTokenSilently();

        const saunaResponse = await fetch(`http://localhost:5001/api/saunas/${saunaId}`, {
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
        setIsLoading(false);
      }
    };

    if (saunaId) {
      fetchData();
    }
  }, [saunaId, getAccessTokenSilently, refreshKey]);




  useEffect(() => {
    const fetchAllUserBookings = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        const token = await getAccessTokenSilently();
        const response = await fetch(
          'http://localhost:5001/api/bookings/my-bookings',
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
          description: "Failed to load your bookings 2"
        });
      }
    };

    if (saunaId) {
      fetchAllUserBookings();
    }
  }, [saunaId, getAccessTokenSilently, refreshKey]);

  useEffect(() => {
    setSelectedSlots(null);
  }, [refreshKey])


  if (isLoading) {
    return <LoadingAnimation isLoading={isLoading} text="Loading sauna details..." />;
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlowCard className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-8"> 
              <div className="w-full lg:w-auto px-4"> 
                <BookingSaunaTitle
                  title={sauna.name}
                />
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date) {
                    setDate(date);
                    setSelectedSlots(null);
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