import { ISauna } from "./SaunaTypes";

export interface TimeSlot {
  startTime: string | Date;
  endTime: string | Date;
  isAvailable: boolean;
  currentBookings: number;
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
