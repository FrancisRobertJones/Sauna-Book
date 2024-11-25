// src/services/BookingService.ts
import { Service } from 'typedi';
import { BookingRepository } from '../repositories/BookingRepository';
import { SaunaService } from './SaunaService';
import { BookingDTO, IBooking, BookingStatus } from '../models/Booking';
import { ApplicationError } from '../utils/errors';

@Service()
export class BookingService {
    constructor(
        private bookingRepository: BookingRepository,
        private saunaService: SaunaService
    ) {}

    async createBooking(bookingData: BookingDTO): Promise<IBooking> {
        const sauna = await this.saunaService.findById(bookingData.saunaId);
        if (!sauna) {
            throw new ApplicationError('Sauna not found', 404);
        }

        const slotAligns = this.validateTimeSlot(
            bookingData.startTime,
            bookingData.endTime,
            sauna.slotDurationMinutes
        );
        if (!slotAligns) {
            throw new ApplicationError('Invalid time slot', 400);
        }

        const overlappingBookings = await this.bookingRepository
            .findOverlappingBookings(
                bookingData.saunaId,
                bookingData.startTime,
                bookingData.endTime
            );

        if (overlappingBookings.length >= sauna.maxConcurrentBookings) {
            throw new ApplicationError('Time slot is fully booked', 400);
        }

        const userBookings = await this.bookingRepository
            .findUserActiveBookings(bookingData.userId);
        
        if (userBookings.length >= sauna.maxBookingsPerUser) {
            throw new ApplicationError('Maximum booking limit reached', 400);
        }

        const booking = await this.bookingRepository.create(bookingData);

        // TODOFJ: Send confirmation email
        
        return booking;
    }

    async getBookingsForDate(saunaId: string, date: Date): Promise<IBooking[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return this.bookingRepository.findByDateRange(
            saunaId,
            startOfDay,
            endOfDay
        );
    }

    async updateBookingStatus(
        bookingId: string,
        userId: string,
        status: string
    ): Promise<IBooking> {
        const booking = await this.bookingRepository.findById(bookingId);
        
        if (!booking) {
            throw new ApplicationError('Booking not found', 404);
        }

        if (booking.userId !== userId) {
            throw new ApplicationError('Unauthorized', 403);
        }

        const updatedBooking = await this.bookingRepository
            .updateStatus(bookingId, status);
        
        if (!updatedBooking) {
            throw new ApplicationError('Failed to update booking', 500);
        }

        // TODOFJ: If early completion, notify waiting list

        return updatedBooking;
    }

    private validateTimeSlot(
        startTime: Date,
        endTime: Date,
        slotDuration: number
    ): boolean {
        const durationMinutes = 
            (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        return durationMinutes === slotDuration;
    }
}