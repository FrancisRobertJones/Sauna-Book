import { Service } from 'typedi';
import { BookingRepository } from '../repositories/BookingRepository';
import { SaunaService } from './SaunaService';
import { UserService } from './UserService';
import { ApplicationError } from '../utils/errors';
import { generateTimeSlots } from '../utils/booking-utils';

@Service()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private saunaService: SaunaService,
    private userService: UserService
  ) {}

  async getAvailableSlots(saunaId: string, date: Date) {
    const sauna = await this.saunaService.findById(saunaId);
    if (!sauna) {
      throw new ApplicationError('Sauna not found', 404);
    }

    const existingBookings = await this.bookingRepository.findBySaunaAndDate(
      saunaId,
      date
    );

    const slots = generateTimeSlots(
      date,
      sauna.operatingHours,
      sauna.slotDurationMinutes,
      existingBookings,
      sauna.maxConcurrentBookings
    );

    return slots;
  }

  async createBooking(userId: string, saunaId: string, startTime: Date) {
    const hasAccess = await this.userService.hasAccessToSauna(userId, saunaId);
    if (!hasAccess) {
      throw new ApplicationError('User does not have access to this sauna', 403);
    }

    const sauna = await this.saunaService.findById(saunaId);
    if (!sauna) {
      throw new ApplicationError('Sauna not found', 404);
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + sauna.slotDurationMinutes);

    const concurrentBookings = await this.bookingRepository.countConcurrentBookings(
      saunaId,
      startTime,
      endTime
    );

    if (concurrentBookings >= sauna.maxConcurrentBookings) {
      throw new ApplicationError('This time slot is fully booked', 400);
    }

    const userBookings = await this.bookingRepository.countUserActiveBookings(userId);
    if (sauna.maxBookingsPerUser && userBookings >= sauna.maxBookingsPerUser) {
      throw new ApplicationError('User has reached maximum booking limit', 400);
    }

    return this.bookingRepository.create({
      userId,
      saunaId,
      startTime,
      endTime,
      status: 'active'
    });
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApplicationError('Booking not found', 404);
    }

    if (booking.userId !== userId) {
      throw new ApplicationError('Not authorized to cancel this booking', 403);
    }

    if (booking.startTime <= new Date()) {
      throw new ApplicationError('Cannot cancel past or ongoing bookings', 400);
    }

    return this.bookingRepository.updateStatus(bookingId, 'cancelled');
  }

  async getUserBookings(userId: string) {
    return this.bookingRepository.findByUser(userId);
  }

  async getBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApplicationError('Booking not found', 404);
    }

    if (booking.userId !== userId) {
      throw new ApplicationError('Not authorized to view this booking', 403);
    }

    return booking;
  }

  async getSaunaBookings(saunaId: string, userId: string, date?: Date) {
    const sauna = await this.saunaService.findById(saunaId);
    if (!sauna || sauna.adminId !== userId) {
      throw new ApplicationError('Not authorized to view these bookings', 403);
    }

    return this.bookingRepository.findBySaunaAndDate(saunaId, date);
  }
}