import { Service } from 'typedi';
import { WaitingListRepository } from '../repositories/WaitingListRepository';
import { UserService } from './UserService';
import { EmailService } from './EmailService';
import { ApplicationError, isMongoError } from '../utils/errors';
import mongoose from 'mongoose';
import { SaunaService } from './SaunaService';
import { IWaitingList } from '../models/WaitList';
import { SaunaRepository } from '../repositories/SaunaRepository';

@Service()
export class WaitingListService {
    constructor(
        private waitingListRepository: WaitingListRepository,
        private userService: UserService,
        private emailService: EmailService,
        private saunaRepository: SaunaRepository
    ) { }

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

                if (!nextUser._id) {
                    throw new Error('Invalid waitlist entry: missing _id');
                }

                await this.waitingListRepository.markAsNotified(nextUser._id.toString());
            }
        } catch (error) {
            console.error('Error notifying waitlist user:', error);
            if (error instanceof Error) {
                throw new ApplicationError(error.message, 500);
            }
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