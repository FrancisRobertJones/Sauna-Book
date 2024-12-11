import { Service } from 'typedi';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserService } from '../services/UserService';
import { InviteService } from '../services/InviteService';
import { AuthRequest } from '../types/auth.types';

@Service()
export class UserController {
    constructor(
        private userService: UserService,
        private inviteService: InviteService
    ) { }

    getCurrentUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;
            const email = authReq.auth?.payload['https://api.frj-sauna-booking.com/email'] as string;
            const name = authReq.auth?.payload['https://api.frj-sauna-booking.com/name'] as string;
            const registerIntent = req.query.register_intent as string;

            if (!auth0Id || !email || !name) {
                res.status(400).json({ error: 'Missing required user information' });
                return;
            }

            let user = await this.userService.findUserByAuth0Id(auth0Id);

            console.log("attempting to create user")
            if (!user) {
                if (registerIntent === 'admin') {
                    user = await this.userService.createUser(auth0Id, email, name, 'admin');
                } else if (registerIntent === 'user') {
                    user = await this.userService.createUser(auth0Id, email, name, 'user');
                } else {
                    res.status(400).json({ error: 'Invalid registration intent' });
                    return;
                }
            }

            const [hasPendingInvites, isSaunaMember] = await Promise.all([
                this.inviteService.hasPendingInvites(auth0Id),
                this.userService.isSaunaMember(auth0Id)
            ]);

            res.json({
                ...user.toJSON(),
                status: {
                    hasPendingInvites,
                    isSaunaMember
                }
            });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}