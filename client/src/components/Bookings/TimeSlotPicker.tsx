import { cn } from "@/lib/utils"
import { TimeSlot, TimeSlotPickerProps } from "@/types/BookingTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "../Loading/Loading";
import { Button } from "../ui/button";
import { format } from 'date-fns';
import { GlowCard } from "../ui/GlowCard";
import { apiUrl } from "@/constants/api-url";
import BookingLimitInfo from "./BookingLimitInfo";



export function TimeSlotPicker({
    sauna,
    selectedDate,
    selectedSlots,
    onSlotsSelect,
}: TimeSlotPickerProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    const [hasReachedLimit, setHasReachedLimit] = useState(false);
    const [lastFetchedDate, setLastFetchedDate] = useState<string | null>(null);
    const [userTotalBookings, setUserTotalBookings] = useState<number>(0);


    const normalizeDateString = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchSlotsForDate = async () => {
            const normalizedSelectedDate = normalizeDateString(selectedDate);


            if (lastFetchedDate === null || normalizedSelectedDate !== lastFetchedDate) {
                setIsLoading(true);
                setTimeSlots([]);
                setHasReachedLimit(false);

                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch(
                        `${apiUrl}/api/bookings/available-slots/${sauna._id}?date=${selectedDate.toISOString()}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache'
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch time slots');
                    }

                    const slots = await response.json();
                    setTimeSlots(slots);
                    setLastFetchedDate(normalizedSelectedDate);
                } catch (error) {
                    setTimeSlots([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchSlotsForDate();
    }, [selectedDate, sauna._id, getAccessTokenSilently]);

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(
                    `${apiUrl}/api/bookings/user-bookings-count/${sauna._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Cache-Control': 'no-cache'
                        }
                    }
                );

                if (response.ok) {
                    const { count } = await response.json();
                    setUserTotalBookings(count);
                }
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        };

        fetchUserBookings();
    }, [sauna._id, getAccessTokenSilently]);

    const getSlotStatus = (slot: TimeSlot) => {
        if (!slot.isAvailable) return "unavailable";
        if (isSlotSelectable(slot)) return "selectable";
        return "disabled";
    };

    const resetSelection = () => {
        onSlotsSelect(null);
        setHasReachedLimit(false);

    };

    const handleSlotSelect = (slotTime: string) => {
        const selectedIndex = timeSlots.findIndex(slot =>
            new Date(slot.startTime).toISOString() === slotTime
        );

        if (!timeSlots[selectedIndex].isAvailable) return;
        if (hasReachedLimit) return;

        const checkConsecutiveAvailability = (startIndex: number, count: number) => {
            for (let i = startIndex; i < startIndex + count; i++) {
                if (!timeSlots[i] || !timeSlots[i].isAvailable) {
                    return false;
                }
            }
            return true;
        };

        if (!selectedSlots) {
            onSlotsSelect({
                startSlot: slotTime,
                numberOfSlots: 1
            });

            if (sauna.maxConcurrentBookings === 1) {
                setHasReachedLimit(true);
            }
            return;
        }

        const currentIndex = timeSlots.findIndex(slot =>
            new Date(slot.startTime).toISOString() === selectedSlots.startSlot
        );

        const isConsecutive = selectedIndex === currentIndex + selectedSlots.numberOfSlots;
        const isWithinLimit = selectedSlots.numberOfSlots < sauna.maxConcurrentBookings;

        if (isConsecutive && isWithinLimit) {
            if (checkConsecutiveAvailability(currentIndex, selectedSlots.numberOfSlots + 1)) {
                const newNumberOfSlots = selectedSlots.numberOfSlots + 1;
                onSlotsSelect({
                    startSlot: selectedSlots.startSlot,
                    numberOfSlots: newNumberOfSlots
                });

                if (newNumberOfSlots === sauna.maxConcurrentBookings) {
                    setHasReachedLimit(true);
                }
            }
        } else {
            onSlotsSelect({
                startSlot: slotTime,
                numberOfSlots: 1
            });

            if (sauna.maxConcurrentBookings === 1) {
                setHasReachedLimit(true);
            }
        }
    };
    const isSlotSelectable = (slot: TimeSlot) => {
        if (!slot.isAvailable) return false;
        if (hasReachedLimit) return false;
        if (userTotalBookings >= sauna.maxTotalBookings) return false;

        if (sauna.maxConcurrentBookings === 1 && selectedSlots) return false;

        if (!selectedSlots) return true;

        const currentIndex = timeSlots.findIndex(s =>
            new Date(s.startTime).toISOString() === selectedSlots.startSlot
        );
        const slotIndex = timeSlots.findIndex(s =>
            new Date(s.startTime).toISOString() === new Date(slot.startTime).toISOString()
        );

        return slotIndex === currentIndex + selectedSlots.numberOfSlots;
    };

    const isSlotSelected = (slot: TimeSlot) => {
        if (!selectedSlots) return false;

        const slotTime = new Date(slot.startTime).toISOString();
        const currentIndex = timeSlots.findIndex(s =>
            new Date(s.startTime).toISOString() === selectedSlots.startSlot
        );
        const slotIndex = timeSlots.findIndex(s =>
            new Date(s.startTime).toISOString() === slotTime
        );

        return slotIndex >= currentIndex &&
            slotIndex < currentIndex + selectedSlots.numberOfSlots;
    };

    if (isLoading) {
        return <LoadingAnimation isLoading={isLoading} text="Loading available times..." />;
    }

    return (
        <GlowCard className="rounded-lg border bg-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Available Time Slots</h2>
                {selectedSlots && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetSelection}
                    >
                        Clear Selection
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.map((slot) => {
                    const status = getSlotStatus(slot);
                    return (
                        <Button
                            key={new Date(slot.startTime).toISOString()}
                            variant={isSlotSelected(slot) ? "default" : "outline"}
                            className={cn(
                                "w-full",
                                status === "unavailable" && "bg-destructive/10 text-destructive hover:bg-destructive/20",
                                status === "selectable" && "hover:bg-primary/10",
                                status === "disabled" && "opacity-50"
                            )}
                            disabled={status !== "selectable"}
                            onClick={() => handleSlotSelect(new Date(slot.startTime).toISOString())}
                        >
                            {format(new Date(slot.startTime), 'HH:mm')}
                        </Button>
                    );
                })}
            </div>
            {selectedSlots && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Selected duration: {selectedSlots.numberOfSlots * sauna.slotDurationMinutes} minutes
                    </p>
                    {!hasReachedLimit && selectedSlots.numberOfSlots < sauna.maxConcurrentBookings && (
                        <p className="text-sm text-muted-foreground">
                            You can select up to {sauna.maxConcurrentBookings - selectedSlots.numberOfSlots} more consecutive slots
                        </p>
                    )}
                    {hasReachedLimit && (
                        <p className="text-sm text-muted-foreground">
                            Maximum consecutive slots selected
                        </p>
                    )}
                </div>
            )}
            <BookingLimitInfo
                userTotalBookings={userTotalBookings}
                maxTotalBookings={sauna.maxTotalBookings}
            />
        </GlowCard>
    );
}