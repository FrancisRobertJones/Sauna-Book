import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "../components/Bookings/TimeSlotPicker"
import { BookingDetails } from "../components/Bookings/BookingDetails"
import { ISauna } from "@/types/SaunaTypes"
import { LoadingAnimation } from "@/components/Loading/Loading"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function BookingPage() {
  const { saunaId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [sauna, setSauna] = useState<ISauna | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  useEffect(() => {
    const fetchSauna = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`http://localhost:5001/api/saunas/${saunaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sauna details');
        }

        const data = await response.json();
        setSauna(data);
      } catch (error) {
        console.error('Error fetching sauna:', error);
        toast({
          title: "Error",
          description: "Failed to load sauna details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSauna();
  }, [saunaId, getAccessTokenSilently]);

  useEffect(() => {
    setSelectedTimeSlot(null);
  }, [date]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book {sauna.name}</h1>
        {sauna.location && (
          <p className="text-muted-foreground mt-2">{sauna.location}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </Card>

          <TimeSlotPicker
            sauna={sauna}
            selectedDate={date}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={setSelectedTimeSlot}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingDetails
            sauna={sauna}
            selectedDate={date}
            selectedTimeSlot={selectedTimeSlot}
          />
        </div>
      </div>
    </div>
  );
}