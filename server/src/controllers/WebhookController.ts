import { Service } from 'typedi';
import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

@Service()
export class WebhookController {
  constructor(private notificationService: NotificationService) {}

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
}