import { Service } from 'typedi';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserService } from '../services/UserService';
import { UserDTO } from '../models/User';
import { AuthRequest } from '../types/auth.types';



@Service()
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    getCurrentUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;
            const email = authReq.auth?.payload['https://api.frj-sauna-booking.com/email'] as string;
            const name = authReq.auth?.payload['https://api.frj-sauna-booking.com/name'] as string;

            if (!auth0Id || !email || !name) {
                res.status(400).json({ error: 'Missing required user information' });
                return;
            }

            const user = await this.userService.findOrCreateUser(auth0Id, email, name);
            res.json(user);
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