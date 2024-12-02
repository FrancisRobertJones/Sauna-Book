import { cn } from "@/lib/utils"
import { TimeSlot, TimeSlotPickerProps } from "@/types/BookingTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "../Loading/Loading";
import { Button } from "../ui/button";


export function TimeSlotPicker({
    sauna,
    selectedDate,
    selectedTimeSlot,
    onTimeSlotSelect,
}: TimeSlotPickerProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                setIsLoading(true);
                const token = await getAccessTokenSilently();

                const response = await fetch(
                    `http://localhost:5001/api/bookings/available-slots/${sauna._id}?date=${selectedDate.toISOString()}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch time slots');

                const slots = await response.json();
                setTimeSlots(slots);
            } catch (error) {
                console.error('Error fetching time slots:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [sauna._id, selectedDate]);

    if (isLoading) {
        return <LoadingAnimation isLoading={isLoading} text="Loading available times..." />;
    }

    return (
        <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                    <Button
                        key={slot.time}
                        variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                        className={cn(
                            "w-full",
                            !slot.isAvailable && "bg-destructive/10 text-destructive hover:bg-destructive/20",
                            slot.isAvailable && "hover:bg-primary/10"
                        )}
                        disabled={!slot.isAvailable}
                        onClick={() => slot.isAvailable && onTimeSlotSelect(slot.time)}
                    >
                        {slot.time}
                    </Button>
                ))}
            </div>
        </div>
    );
}