import { Service } from 'typedi';
import { WaitingListRepository } from '../repositories/WaitingListRepository';
import { UserService } from './UserService';
import { EmailService } from './EmailService';
import { ApplicationError } from '../utils/errors';
import { IWaitingList } from '../models/WaitList';
import { SaunaRepository } from '../repositories/SaunaRepository';
import { Client } from '@upstash/qstash';
import { BookingRepository } from '../repositories/BookingRepository';

@Service()
export class WaitingListService {
    private qstash: Client;

    constructor(
        private waitingListRepository: WaitingListRepository,
        private userService: UserService,
        private emailService: EmailService,
        private saunaRepository: SaunaRepository,
        private bookingRepository: BookingRepository
    ) {
        if (!process.env.QSTASH_TOKEN) {
            throw new Error('QSTASH_TOKEN is not defined');
        }

        this.qstash = new Client({
            token: process.env.QSTASH_TOKEN
        });
    }

    async addToWaitlist(userId: string, saunaId: string, slotTime: Date, bookingId: string) {
        const user = await this.userService.getUser(userId);

        const hasAccess = user.saunaAccess.some(
            accessId => accessId.toString() === saunaId
        );

        if (!hasAccess) {
            throw new ApplicationError('User does not have access to this sauna', 403);
        }

        try {
            const waitlistEntry = await this.waitingListRepository.create({
                userId,
                saunaId,
                slotTime,
                bookingId,
            });

            console.log('Created waitlist entry:', waitlistEntry);

            const positions = await this.waitingListRepository.getUserWaitlistPositions(
                userId,
                saunaId
            );

            return {
                waitlistEntry,
                position: positions.find(p => p.slotTime.getTime() === slotTime.getTime())?.position
            };
        } catch (error) {
            console.error('Error in addToWaitlist:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
            throw error;
        }
    }

    async notifyNextInWaitlist(saunaId: string, slotTime: Date) {
        try {
            const booking = await this.bookingRepository.findActiveBookingForSlot(saunaId, slotTime);
            if (booking) {
                console.log('Slot has been booked in the meantime, stopping notification chain');
                return;
            }

            const waitlistEntries = await this.waitingListRepository.findBySlot(saunaId, slotTime);
            if (waitlistEntries.length === 0) return;

            const nextUser = waitlistEntries[0] as IWaitingList;
            const user = await this.userService.getUser(nextUser.userId);
            const sauna = await this.saunaRepository.findById(saunaId);

            if (user?.email && sauna) {
                await this.emailService.sendWaitlistNotification(
                    user.email,
                    slotTime,
                    sauna.name
                );

                await this.waitingListRepository.markAsNotified(nextUser._id.toString());

                if (waitlistEntries.length > 1) {
                    const nextNotificationTime = new Date(Date.now() + 60 * 60 * 1000);

                    const baseUrl = process.env.API_URL || 'http://localhost:5001';
                    const webhookUrl = new URL('/api/webhook/notifications/waitlist-next', baseUrl).toString();

                    await this.qstash.publishJSON({
                        url: webhookUrl,
                        body: {
                            saunaId,
                            slotTime: slotTime.toISOString()
                        },
                        notBefore: Math.floor(nextNotificationTime.getTime() / 1000)
                    });
                }
            }
        } catch (error) {
            console.error('Error notifying waitlist user:', error);
            throw new ApplicationError('Failed to notify next user in waitlist', 500);
        }
    }


    async removeFromWaitlist(userId: string, saunaId: string, slotTime: Date) {
        await this.waitingListRepository.removeFromWaitlist(userId, saunaId, slotTime);
    }

    async getUserWaitlistStatus(userId: string, saunaId: string) {
        const positions = await this.waitingListRepository.getUserWaitlistPositions(userId, saunaId);
        console.log('Backend positions:', positions);
        return positions;
    }
}