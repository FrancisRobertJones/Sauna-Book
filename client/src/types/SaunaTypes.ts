export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  currentBookings: number;
}
  
  export interface OperatingHours {
    weekday: TimeSlot;
    weekend: TimeSlot;
  }
  
  export interface ISauna {
    _id: string;
    name: string;
    adminId: string;
    slotDurationMinutes: number;
    operatingHours: OperatingHours;
    maxConcurrentBookings: number;    
    maxTotalBookings: number;        
    location?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface SaunaDTO {
    name: string;
    adminId: string;
    slotDurationMinutes: number;
    operatingHours: OperatingHours;
    maxConcurrentBookings: number;
    maxTotalBookings?: number;
    location?: string;
    description?: string;
  }
  
  export interface TimeSlotAvailability {
    time: string;         
    isAvailable: boolean;
    currentBookings: number;  
  }
  
  export interface DayAvailability {
    date: string;         
    slots: TimeSlotAvailability[];
  }