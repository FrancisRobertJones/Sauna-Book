import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { SaunaService } from '../services/SaunaService';
import { AuthRequest } from '../types/auth.types';
import { RequestHandler } from 'express';
import { UserService } from '../services/UserService';

@Service()
export class SaunaController {
    constructor(
        private saunaService: SaunaService,
        private userService: UserService
    ) {}

    createSauna: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.auth?.payload.sub;

            if (!adminId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const sauna = await this.saunaService.createSauna({
                ...req.body,
                adminId
            });

            try {
                await this.userService.updateRole(adminId, 'admin');
            } catch (error) {
                console.error('Failed to update user role:', error);
            }

            res.status(201).json(sauna);
        } catch (error) {
            next(error);
        }
    };

    getSauna: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const sauna = await this.saunaService.findById(req.params.id);
            if (!sauna) {
                res.status(404).json({ error: 'Sauna not found' });
                return;
            }
            res.json(sauna);
        } catch (error) {
            next(error);
        }
    };


    getAdminSaunas: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.auth?.payload.sub;
            if (!adminId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const saunas = await this.saunaService.findByAdminId(adminId);
            res.json(saunas || []);
        } catch (error) {
            next(error);
        }
    }

    async getSaunaUsers(req: Request, res: Response) {
        const authReq = req as AuthRequest;
        const adminId = authReq.auth?.payload.sub;
        const { id } = req.params;

        if (!id || !adminId) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
        }

        const users = await this.userService.getUsersBySauna(id, adminId)
        res.json(users);
    }

    async removeSaunaAccess(req: Request, res: Response) {
        const authReq = req as AuthRequest;
        const adminId = authReq.auth?.payload.sub;
        const { saunaId, userId } = req.params;

        if (!saunaId || !userId || !adminId) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
        }

        await this.userService.removeSaunaAccess(userId, saunaId, adminId);
        res.status(200).json({ message: 'Access removed successfully' });
    }
}
