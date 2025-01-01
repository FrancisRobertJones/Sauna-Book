import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitingList extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  saunaId: mongoose.Types.ObjectId;
  slotTime: Date;
  bookingId: mongoose.Types.ObjectId;
  notified: boolean;
}

const WaitingListSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  saunaId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'saunas',
  },
  slotTime: {
    type: Date,
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'bookings',
  },
  notified: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

export const WaitingList = mongoose.models.WaitingList || 
  mongoose.model<IWaitingList>('WaitingList', WaitingListSchema);