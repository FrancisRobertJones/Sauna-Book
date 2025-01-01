import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { WaitingListService } from '../services/WaitingListService';
import { AuthRequest } from '../types/auth.types';
import mongoose from 'mongoose';

@Service()
export class WaitingListController {
    constructor(private waitingListService: WaitingListService) {}

    addToWaitlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;
            const { saunaId } = req.params;
            const { slotTime, bookingId } = req.body; 
    
            if (!auth0Id) {
                res.status(401).json({ error: 'Unauthorized - No auth0Id' });
                return;
            }
    
            if (!mongoose.Types.ObjectId.isValid(saunaId) || !mongoose.Types.ObjectId.isValid(bookingId)) {
                res.status(400).json({ error: 'Invalid ID format' });
                return;
            }
    
            const result = await this.waitingListService.addToWaitlist(
                auth0Id,
                saunaId,
                new Date(slotTime),
                bookingId
            );
    
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    removeFromWaitlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;
            const { saunaId } = req.params;
            const { slotTime } = req.body;

            if (!auth0Id) {
                res.status(401).json({ error: 'Unauthorized - No auth0Id' });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(saunaId)) {
                res.status(400).json({ error: 'Invalid sauna ID' });
                return;
            }

            await this.waitingListService.removeFromWaitlist(
                auth0Id,
                saunaId,
                new Date(slotTime)
            );

            res.status(200).json({ message: 'Removed from waitlist' });
        } catch (error) {
            next(error);
        }
    };

    getWaitlistStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;
            const { saunaId } = req.params;

            if (!auth0Id) {
                res.status(401).json({ error: 'Unauthorized - No auth0Id' });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(saunaId)) {
                res.status(400).json({ error: 'Invalid sauna ID' });
                return;
            }

            const status = await this.waitingListService.getUserWaitlistStatus(
                auth0Id,
                saunaId
            );

            res.status(200).json(status);
        } catch (error) {
            next(error);
        }
    };
}