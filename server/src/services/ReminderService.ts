import { Service } from 'typedi';
import { BookingRepository } from '../repositories/BookingRepository';
import { qstash } from '../utils/qstash';
import { ReminderRepository } from '../repositories/ReminderRepository';
import { Types } from 'mongoose';

@Service()
export class ReminderService {
    constructor(
        private reminderRepo: ReminderRepository,
        private bookingRepo: BookingRepository
    ) { }

    async createReminder(bookingId: string, userId: string) {
        const booking = await this.bookingRepo.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        const reminderTime = new Date(booking.startTime);
        reminderTime.setHours(reminderTime.getHours() - 1);

        const notification = await this.reminderRepo.create({
            bookingId: new Types.ObjectId(bookingId),
            userId,
            scheduledFor: reminderTime,
            status: 'pending'
        });

        const baseUrl = process.env.API_URL || 'http://localhost:5001';
        const webhookUrl = new URL('/api/notifications/send', baseUrl).toString();
    

        await qstash.publishJSON({
            url: webhookUrl,
            body: {
                notificationId: notification._id,
                bookingId
            },
            notBefore: Math.floor(reminderTime.getTime() / 1000)
        });

        return notification;
    }

    async deleteReminder(bookingId: string, userId: string) {
        return this.reminderRepo.deleteByBookingAndUser(bookingId, userId);
    }

    async getReminderStatus(bookingId: string, userId: string) {
        const notification = await this.reminderRepo.findByBookingAndUser(bookingId, userId);
        return !!notification;
    }
}