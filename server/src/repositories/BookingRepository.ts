// src/repositories/BookingRepository.ts
import { Service } from 'typedi';
import { Booking, IBooking, BookingDTO } from '../models/Booking';
import mongoose from 'mongoose';

@Service()
export class BookingRepository {
    async create(bookingData: BookingDTO): Promise<IBooking> {
        const booking = new Booking(bookingData);
        return booking.save();
    }

    async findById(id: string): Promise<IBooking | null> {
        return Booking.findById(id);
    }

    async findByDateRange(
        saunaId: string,
        startDate: Date,
        endDate: Date
    ): Promise<IBooking[]> {
        return Booking.find({
            saunaId: new mongoose.Types.ObjectId(saunaId),
            startTime: { $gte: startDate },
            endTime: { $lte: endDate },
            status: { $ne: 'cancelled' }
        }).sort({ startTime: 1 });
    }

    async findOverlappingBookings(
        saunaId: string,
        startTime: Date,
        endTime: Date
    ): Promise<IBooking[]> {
        return Booking.find({
            saunaId: new mongoose.Types.ObjectId(saunaId),
            status: 'active',
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                },
                {
                    startTime: { $lte: startTime },
                    endTime: { $gte: endTime }
                }
            ]
        });
    }

    async updateStatus(
        bookingId: string,
        status: string
    ): Promise<IBooking | null> {
        return Booking.findByIdAndUpdate(
            bookingId,
            { $set: { status } },
            { new: true }
        );
    }

    async findUserActiveBookings(userId: string): Promise<IBooking[]> {
        return Booking.find({
            userId,
            status: 'active',
            startTime: { $gte: new Date() }
        }).sort({ startTime: 1 });
    }
}