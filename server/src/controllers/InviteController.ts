import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { InviteService } from '../services/InviteService';
import { AuthRequest } from '../types/auth.types';
import { RequestHandler } from 'express';
import { z } from 'zod';
import { CreateInviteSchema } from '../models/Invite';



@Service()
export class InviteController {
    constructor(private inviteService: InviteService) { }

    createInvite: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.auth?.payload.sub;

            if (!adminId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const validatedData = CreateInviteSchema.parse(req.body);

            const invite = await this.inviteService.createInvite(
                validatedData.saunaId,
                validatedData.email,
                adminId
            );

            res.status(201).json(invite);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            next(error);
        }
    };

    getInvitesBySauna: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.auth?.payload.sub;
            const { saunaId } = req.params;

            if (!adminId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const invites = await this.inviteService.getInvitesBySauna(
                saunaId,
                adminId
            );

            res.json(invites);
        } catch (error) {
            next(error);
        }
    };

    cancelInvite: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.auth?.payload.sub;
            const { inviteId } = req.params;

            console.log("hello withdraw")

            if (!adminId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const invite = await this.inviteService.cancelInvite(
                inviteId,
                adminId
            );

            res.json(invite);
        } catch (error) {
            next(error);
        }
    };

    processInvites: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.auth?.payload.sub;
            const email = authReq.auth?.payload['https://api.frj-sauna-booking.com/email'] as string;

            if (!userId || !email) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            await this.inviteService.processUserInvites(email, userId);
            res.json({ message: 'Invites processed successfully' });
        } catch (error) {
            next(error);
        }
    };
}