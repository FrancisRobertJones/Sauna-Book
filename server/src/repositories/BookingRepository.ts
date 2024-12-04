import { Service } from 'typedi';
import { Booking } from '../models/Booking';
import mongoose from 'mongoose';

@Service()
export class BookingRepository {
  async findById(id: string) {
    return Booking.findById(id).populate('saunaId').exec();
  }

  async findByUser(userId: string) {
    return Booking.find({
      userId,
      status: 'active',
      startTime: { $gte: new Date() }
    })
      .populate('saunaId')
      .sort({ startTime: 1 })
      .exec();
  }

  async findBySaunaAndDate(saunaId: string, date?: Date) {
    const query: any = {
      saunaId: new mongoose.Types.ObjectId(saunaId),
      status: 'active'
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    return Booking.find(query)
      .populate('saunaId')
      .sort({ startTime: 1 })
      .exec();
  }

  async findBySauna(saunaId: string) {
    console.log("here is the saunaid for bookings " + saunaId)
    return Booking.find({
        saunaId: new mongoose.Types.ObjectId(saunaId)
    })
    .sort({ startTime: 1 })
    .lean()  
    .exec();
}

  async countConcurrentBookings(saunaId: string, startTime: Date, endTime: Date) {
    return Booking.countDocuments({
      saunaId: new mongoose.Types.ObjectId(saunaId),
      status: 'active',
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });
  }

  async countUserActiveBookings(userId: string) {
    return Booking.countDocuments({
      userId,
      status: 'active',
      startTime: { $gte: new Date() }
    });
  }

  async create(bookingData: {
    userId: string;
    saunaId: string;
    startTime: Date;
    endTime: Date;
    status: 'active' | 'cancelled' | 'completed';
  }) {
    const booking = new Booking(bookingData);
    return booking.save();
  }

  async updateStatus(
    bookingId: string,
    status: 'active' | 'cancelled' | 'completed'
  ) {
    return Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate('saunaId');
  }

  async markCompletedBookings() {
    const now = new Date();
    return Booking.updateMany(
      {
        status: 'active',
        endTime: { $lt: now }
      },
      {
        status: 'completed'
      }
    );
  }
}