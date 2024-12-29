import { BookingRepository } from "../repositories/BookingRepository";
import { ReminderRepository } from "../repositories/ReminderRepository";
import { EmailService } from "./EmailService";
import { UserRepository } from "../repositories/UserRepository";
import { SaunaRepository } from "../repositories/SaunaRepository";
import { Service } from "typedi";

@Service()
export class NotificationService {
    constructor(
        private reminderRepository: ReminderRepository,
        private bookingRepository: BookingRepository,
        private emailService: EmailService,
        private userRepository: UserRepository, 
        private saunaRepository: SaunaRepository 
    ) {}

    async sendNotification(notificationId: string, bookingId: string) {
        const notification = await this.reminderRepository.findById(notificationId);
        const booking = await this.bookingRepository.findById(bookingId);

        if (!notification || !booking) {
            throw new Error('Notification or booking not found');
        }

        const user = await this.userRepository.findByAuth0Id(notification.userId);
        const sauna = await this.saunaRepository.findById(booking.saunaId);

        if (!user?.email || !sauna) {
            throw new Error('User email or sauna not found');
        }

        await this.emailService.sendBookingReminderEmail(
            user.email,
            booking,
            sauna.name
        );

        notification.status = 'sent';
        await notification.save();
    }
}