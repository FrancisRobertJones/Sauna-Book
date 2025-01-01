import { Service } from 'typedi';
import { BookingRepository } from '../repositories/BookingRepository';
import { qstash } from '../utils/qstash';
import { ReminderRepository } from '../repositories/ReminderRepository';
import { Types } from 'mongoose';
import { Client } from '@upstash/qstash';

@Service()
export class ReminderService {
    private qstash: Client;

    constructor(
        private reminderRepo: ReminderRepository,
        private bookingRepo: BookingRepository
    ) {
        if (!process.env.QSTASH_TOKEN) {
            throw new Error('QSTASH_TOKEN is not defined');
        }

        this.qstash = new Client({
            token: process.env.QSTASH_TOKEN
        });
    }

    async createReminder(bookingId: string, userId: string) {
        const booking = await this.bookingRepo.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        const reminderTime = new Date(booking.startTime);
        reminderTime.setTime(reminderTime.getTime() - (60 * 60 * 1000));

        const notification = await this.reminderRepo.create({
            bookingId: new Types.ObjectId(bookingId),
            userId,
            scheduledFor: reminderTime,
            status: 'pending'
        });

        console.log('Sending to QStash:', {
            reminderTime,
            unixTimestamp: Math.floor(reminderTime.getTime() / 1000)
        });

        const baseUrl = process.env.API_URL || 'http://localhost:5001';
        const webhookUrl = new URL('/api/webhook/notifications/send', baseUrl).toString();

        const qstashResponse = await this.qstash.publishJSON({
            url: webhookUrl,
            body: {
                notificationId: notification._id,
                bookingId
            },
            notBefore: Math.floor(reminderTime.getTime() / 1000)
        });

        console.log('QStash response:', qstashResponse);

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