import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

interface TimeSlot {
  start: string; 
  end: string;
}

interface OperatingHours {
  weekday: TimeSlot;
  weekend: TimeSlot;
}

export const SaunaSchema = z.object({
  name: z.string().min(2),
  adminId: z.string(),
  slotDurationMinutes: z.number().min(30).max(180), 
  operatingHours: z.object({
    weekday: z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    }),
    weekend: z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    })
  }),
  maxConcurrentBookings: z.number().min(1),
  maxTotalBookings: z.number().min(1).optional(),
  location: z.string().optional(),
  description: z.string().optional()
});

const saunaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  adminId: {
    type: String, 
    required: true
  },
  slotDurationMinutes: {
    type: Number,
    required: true
  },
  operatingHours: {
    weekday: {
      start: String,
      end: String
    },
    weekend: {
      start: String,
      end: String
    }
  },
  maxConcurrentBookings: {
    type: Number,
    default: 1
  },
  maxTotalBookings: { 
    type: Number,
    default: 5 
  },
  location: String,
  description: String
}, {
  timestamps: true
});

const bookingSchema = new mongoose.Schema({
  saunaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sauna',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'early_completion'],
    default: 'active'
  },
  actualEndTime: Date
});

const waitingListSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  notified: {
    type: Boolean,
    default: false
  }
});

export interface ISauna extends Document {
  name: string;
  adminId: string;
  slotDurationMinutes: number;
  operatingHours: OperatingHours;
  maxConcurrentBookings: number;
  maxBookingsPerUser:number;
  location?: string;
  description?: string;
}

export const Sauna = mongoose.model<ISauna>('Sauna', saunaSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const WaitingList = mongoose.model('WaitingList', waitingListSchema);