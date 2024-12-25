import { Service } from 'typedi';
import { BookingRepository } from '../repositories/BookingRepository';
import { SaunaService } from './SaunaService';
import { UserService } from './UserService';
import { ApplicationError } from '../utils/errors';
import { generateTimeSlots } from '../utils/booking-utils';
import { UserStats } from '../types/admin.types';
import { UserRepository } from '../repositories/UserRepository';
import { BookingDTO } from '../models/Booking';
import { IUser, UserDTO } from '../models/User';
import { SaunaRepository } from '../repositories/SaunaRepository';

@Service()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private saunaRepository: SaunaRepository,
    private userService: UserService,
    private userRepository: UserRepository
  ) { }

  async getAvailableSlots(saunaId: string, date: Date) {
    const sauna = await this.saunaRepository.findById(saunaId);
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

    const sauna = await this.saunaRepository.findById(saunaId);
    if (!sauna) {
      throw new ApplicationError('Sauna not found', 404);
    }

    const userBookings = await this.bookingRepository.countUserActiveBookings(userId, saunaId);

    if (sauna.maxTotalBookings && userBookings >= sauna.maxTotalBookings) {
    console.log('Debug - Should block booking:', {
      maxAllowed: sauna.maxTotalBookings,
      current: userBookings
    });
    throw new ApplicationError(`Maximum limit of ${sauna.maxTotalBookings} active bookings reached for this sauna`, 400);
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

  async cancelBookingAdmin(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new ApplicationError('Booking not found', 404);
    }
    
    if (booking.startTime <= new Date()) {
      throw new ApplicationError('Cannot cancel past or ongoing bookings', 400);
    }

    return this.bookingRepository.updateStatus(bookingId, 'cancelled');
  }
  

  async getUserBookings(userId: string) {
    return this.bookingRepository.findByUser(userId);
  }

  async getUserBookingsCount(userId: string, saunaId: string): Promise<number> {
    const hasAccess = await this.userService.hasAccessToSauna(userId, saunaId);
    if (!hasAccess) {
        throw new ApplicationError('User does not have access to this sauna', 403);
    }

    return this.bookingRepository.countUserActiveBookings(userId, saunaId);
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
    const sauna = await this.saunaRepository.findById(saunaId);
    if (!sauna || sauna.adminId !== userId) {
      throw new ApplicationError('Not authorized to view these bookings', 403);
    }

    return this.bookingRepository.findBySaunaAndDate(saunaId, date);
  }

  async getAllSaunaBookings(saunaId: string, userId: string) {
    const sauna = await this.saunaRepository.findById(saunaId);
    if (!sauna || sauna.adminId !== userId) {
      throw new ApplicationError('Not authorized to view these bookings', 403);
    }
    return this.bookingRepository.findBySauna(saunaId);

  }

  async getSaunaUsers(saunaId: string, adminId: string): Promise<UserStats[]> {
    const sauna = await this.saunaRepository.findById(saunaId);
    if (!sauna || sauna.adminId !== adminId) {
      throw new ApplicationError('Not authorized to view these users', 403);
    }

    const usersWithAccess = await this.userRepository.findBySaunaAccess(saunaId);

    const userIds = usersWithAccess.map(user => user.auth0Id);
    const bookings: BookingDTO[] = await this.bookingRepository.findBySaunaAndUsers(saunaId, userIds);

    return usersWithAccess.map(user => {
      const userBookings = bookings.filter(booking => booking.userId === user.auth0Id);
      const upcomingBookings = userBookings.filter(
        booking => new Date(booking.startTime) > new Date() && booking.status === 'active'
      ).length;

      return {
        userId: user.auth0Id,
        name: user.name,
        email: user.email,
        upcomingBookings,
        totalBookings: userBookings.length
      };
    });
  }

  async getSaunaUserFromBooking(bookingId: string): Promise<IUser> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApplicationError(`Booking with ID ${bookingId} not found`, 404);
    }

    const user = await this.userRepository.findByAuth0Id(booking.userId)
    if (!user) {
      throw new Error(`User associated with booking ${bookingId} not found`);
    }

    return user;

  }

  async cancelAllFutureBookings(saunaId: string): Promise<void> {
    await this.bookingRepository.cancelAllFutureBookings(saunaId);
  }
  

}