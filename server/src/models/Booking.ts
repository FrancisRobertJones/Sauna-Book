import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

export const BookingStatus = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    EARLY_COMPLETION: 'early_completion'
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];

export const BookingSchema = z.object({
    saunaId: z.string(),
    userId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    status: z.enum([
        BookingStatus.ACTIVE,
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
        BookingStatus.EARLY_COMPLETION
    ])
});

export type BookingDTO = z.infer<typeof BookingSchema>;

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
        enum: Object.values(BookingStatus),
        default: BookingStatus.ACTIVE
    }
}, {
    timestamps: true,
    
    indexes: [
        { saunaId: 1, startTime: 1 },
        { userId: 1, status: 1 }
    ]
});

bookingSchema.pre('save', function(next) {
    if (this.endTime <= this.startTime) {
        next(new Error('End time must be after start time'));
    }
    next();
});

export interface IBooking extends Document {
    saunaId: mongoose.Types.ObjectId;
    userId: string;
    startTime: Date;
    endTime: Date;
    status: BookingStatusType;
    createdAt: Date;
    updatedAt: Date;
}

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
