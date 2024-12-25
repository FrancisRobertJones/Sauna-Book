import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { InviteService } from '../services/InviteService';
import { AuthRequest } from '../types/auth.types';
import { RequestHandler } from 'express';
import { z } from 'zod';
import { CreateInviteSchema } from '../models/Invite';
import { ApplicationError } from '../utils/errors';



@Service()
export class InviteController {
    constructor(private inviteService: InviteService) { }

    createInvite: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.auth?.payload.sub;
            
            if (!adminId) {
                res.status(401).json({ message: 'Unauthorized' });
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
                res.status(400).json({ message: error.errors });
                return;
            }
            
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ 
                    message: error.message 
                });
                return;
            }
            
            console.error('Unexpected error in createInvite:', error);
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

    getPendingInvites: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email } = req.query;

            if (!email || typeof email !== 'string') {
                res.status(400).json({ error: 'Email is required' });
                return;
            }

            const pendingInvites = await this.inviteService.findPendingByEmail(email);
            res.json(pendingInvites);
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

    acceptInvite: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.auth?.payload.sub;
            const { inviteId } = req.params;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            if (!inviteId) {
                res.status(400).json({ error: 'Invite ID is required' });
                return;
            }

            await this.inviteService.acceptInvite(inviteId, userId);
            res.status(200).json({ message: 'Invite accepted successfully' });
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