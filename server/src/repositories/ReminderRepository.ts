import { Notification } from '../models/Notification';
import { INotification } from '../models/Notification';
import { Service } from 'typedi';

@Service()
export class ReminderRepository {
    async create(data: Partial<INotification>) {
        return Notification.create(data);
    }

    async findById(id: string) {
        return Notification.findById(id);
    }

    async findByBookingAndUser(bookingId: string, userId: string) {
        return Notification.findOne({
            bookingId,
            userId,
            status: 'pending'
        });
    }
    async deleteByBookingAndUser(bookingId: string, userId: string) {
        return Notification.findOneAndDelete({ 
          bookingId, 
          userId,
          status: 'pending'
        });
      }
}