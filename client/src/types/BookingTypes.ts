import { ISauna } from "./SaunaTypes";

export interface TimeSlot {
    time: string;
    isAvailable: boolean;
  }
  
export interface TimeSlotPickerProps {
    sauna: ISauna;
    selectedDate: Date;
    selectedTimeSlot: string | null;
    onTimeSlotSelect: (timeSlot: string) => void;
  } 

  export interface Sauna {
    _id: string;
    name: string;
    adminId: string;
  }
  