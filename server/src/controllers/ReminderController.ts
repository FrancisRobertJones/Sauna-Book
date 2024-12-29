import { Service } from 'typedi';
import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { ReminderService } from '../services/ReminderService';

@Service()
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  createReminder = async (req: AuthRequest, res: Response) => {
    try {
      const { bookingId } = req.body;
      const auth0Id = req.auth?.payload.sub;
      
      if (!auth0Id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const notification = await this.reminderService.createReminder(bookingId, auth0Id);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating reminder:', error);
      res.status(500).json({ error: 'Failed to create reminder' });
    }
  };

  deleteReminder = async (req: AuthRequest, res: Response) => {
    try {
      const { bookingId } = req.params;
      const auth0Id = req.auth?.payload.sub;
      
      if (!auth0Id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await this.reminderService.deleteReminder(bookingId, auth0Id);
      res.status(200).json({ message: 'Reminder cancelled' });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      res.status(500).json({ error: 'Failed to delete reminder' });
    }
  };

  getReminderStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { bookingId } = req.params;
      const auth0Id = req.auth?.payload.sub;
      
      if (!auth0Id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const hasReminder = await this.reminderService.getReminderStatus(bookingId, auth0Id);
      res.status(200).json({ hasReminder });
    } catch (error) {
      console.error('Error getting reminder status:', error);
      res.status(500).json({ error: 'Failed to get reminder status' });
    }
  };
}