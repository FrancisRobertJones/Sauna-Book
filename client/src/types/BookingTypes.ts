import { ISauna } from "./SaunaTypes";

export interface TimeSlot {
  startTime: string | Date;
  endTime: string | Date;
  isAvailable: boolean;
  currentBookings: number;
  bookingId?: string;
}

export interface TimeSlotSelection {
  startSlot: string;
  numberOfSlots: number;
}


export interface TimeSlotPickerProps {
  sauna: ISauna;
  selectedDate: Date;
  selectedSlots: TimeSlotSelection | null;
  onSlotsSelect: (slots: TimeSlotSelection | null) => void;
}


export interface Sauna {
  _id: string;
  name: string;
  adminId: string;
}

export interface Booking {
    _id: string;
    saunaId: string;
    userId: string;
    startTime: string;
    endTime: string;
    status: 'active' | 'completed' | 'cancelled' | 'early_completion';
}


export interface BookingDetailsProps {
  sauna: ISauna;
  selectedDate: Date;
  selectedSlots: TimeSlotSelection | null;
  handleRefresh: () => void;
}

export interface WaitlistModalProps {
  slot: TimeSlot;
  onJoinWaitlist: (slot: TimeSlot) => Promise<void>;
}

export interface WaitlistPosition {
  slotTime: string;
  position: number;
}
