  import { OperatingHours } from '../models/Sauna';

  interface Booking {
    startTime: Date;
    endTime: Date;
    status: 'active' | 'cancelled' | 'completed';
  }

  interface TimeSlot {
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    currentBookings: number;
  }

  export function generateTimeSlots(
    date: Date,
    operatingHours: OperatingHours,
    slotDurationMinutes: number,
    existingBookings: Booking[],
    maxConcurrentBookings: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const hours = isWeekend ? operatingHours.weekend : operatingHours.weekday;

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const [startHour, startMinute] = hours.start.split(':').map(Number);
    const [endHour, endMinute] = hours.end.split(':').map(Number);

    let slotStart = new Date(dayStart);
    slotStart.setHours(startHour, startMinute, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(endHour, endMinute, 0, 0);

    while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotStart.getMinutes() + slotDurationMinutes);

        const overlappingBookings = existingBookings.filter(booking => {
            const overlap = booking.status === 'active' &&
                booking.startTime < slotEnd &&
                booking.endTime > slotStart;
            
            console.log('Checking overlap:', {
                slotTime: slotStart.toISOString(),
                overlap,
                bookingTime: booking.startTime.toISOString()
            });
            
            return overlap;
        });

        const isAvailable = overlappingBookings.length === 0;

        slots.push({
            startTime: new Date(slotStart),
            endTime: new Date(slotEnd),
            isAvailable,
            currentBookings: overlappingBookings.length
        });

        slotStart = new Date(slotEnd);
    }

    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return slots.filter(slot => slot.startTime > now);
    }

    return slots;
  }

  export function formatTimeSlot(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  export function isSlotAvailable(
    slot: TimeSlot,
    maxConcurrentBookings: number,
    userBookings: Booking[]
  ): { available: boolean; reason?: string } {
    if (!slot.isAvailable) {
      return { available: false, reason: 'This time slot is fully booked' };
    }

    const hasOverlappingBooking = userBookings.some(booking =>
      booking.status === 'active' &&
      booking.startTime < slot.endTime &&
      booking.endTime > slot.startTime
    );

    if (hasOverlappingBooking) {
      return { available: false, reason: 'You already have a booking during this time' };
    }

    return { available: true };
  }

  export function getNextAvailableSlot(slots: TimeSlot[]): TimeSlot | null {
    return slots.find(slot => slot.isAvailable) || null;
  }

  export function isWithinOperatingHours(
    time: Date,
    operatingHours: OperatingHours
  ): boolean {
    const isWeekend = time.getDay() === 0 || time.getDay() === 6;
    const hours = isWeekend ? operatingHours.weekend : operatingHours.weekday;

    const [startHour, startMinute] = hours.start.split(':').map(Number);
    const [endHour, endMinute] = hours.end.split(':').map(Number);

    const timeHour = time.getHours();
    const timeMinute = time.getMinutes();

    if (timeHour < startHour || timeHour > endHour) {
      return false;
    }

    if (timeHour === startHour && timeMinute < startMinute) {
      return false;
    }

    if (timeHour === endHour && timeMinute > endMinute) {
      return false;
    }

    return true;
  }