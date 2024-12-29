import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
    bookingId: mongoose.Types.ObjectId;
    userId: string;
    scheduledFor: Date;
    status: 'pending' | 'sent' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    scheduledFor: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export const Notification = mongoose.models.Notification ||
    mongoose.model<INotification>('Notification', notificationSchema);