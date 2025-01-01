import { Service } from 'typedi';
import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { WaitingListService } from '../services/WaitingListService';

@Service()
export class WebhookController {
  constructor(
    private notificationService: NotificationService,
    private waitingListService: WaitingListService) { }

  handleNotification = async (req: Request, res: Response) => {
    try {
      const { notificationId, bookingId } = req.body;
      await this.notificationService.sendNotification(notificationId, bookingId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling notification:', error);
      res.status(500).json({ error: 'Failed to handle notification' });
    }
  };

  handleWaitlistNext = async (req: Request, res: Response) => {
    try {
        const { saunaId, slotTime } = req.body;
        await this.waitingListService.notifyNextInWaitlist(saunaId, new Date(slotTime));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error handling next waitlist notification:', error);
        res.status(500).json({ error: 'Failed to process next waitlist notification' });
    }
};
}