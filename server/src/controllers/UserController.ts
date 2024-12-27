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
                const registerIntent = req.query.register_intent as string;
        
                if (!auth0Id || !email) {
                    res.status(400).json({ error: 'Missing required user information' });
                    return;
                }
        
                let user = await this.userService.findUserByAuth0Id(auth0Id);
        
                if (!user) {
                    const auth0Name = authReq.auth?.payload['https://api.frj-sauna-booking.com/name'] as string;
                    if (!auth0Name) {
                        res.status(400).json({ error: 'Missing name for new user' });
                        return;
                    }
        
                    if (registerIntent === 'admin') {
                        user = await this.userService.createUser(auth0Id, email, auth0Name, 'admin');
                    } else if (registerIntent === 'user') {
                        user = await this.userService.createUser(auth0Id, email, auth0Name, 'user');
                    } else {
                        res.status(400).json({ error: 'Invalid registration intent' });
                        return;
                    }
                }
        
                const [hasPendingInvites, isSaunaMember] = await Promise.all([
                    this.inviteService.hasPendingInvites(auth0Id),
                    this.userService.isSaunaMember(auth0Id)
                ]);
        
                const userResponse = {
                    auth0Id: user.auth0Id,
                    email: user.email,
                    name: user.name,  
                    role: user.role,
                    saunaAccess: user.saunaAccess,
                    _id: user._id,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    status: {
                        hasPendingInvites,
                        isSaunaMember
                    }
                };
        
                res.json(userResponse);
            } catch (error) {
                next(error);
            }
        };

    updateUsername = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Update username request received");
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;
            const newName = req.body.name;

            if (!auth0Id) {
                res.status(401).json({ error: 'Unauthorized - No auth0Id' });
                return;
            }

            if (!newName || typeof newName !== 'string' || newName.length < 2) {
                res.status(400).json({ error: 'Invalid name provided' });
                return;
            }

            const updatedUser = await this.userService.updateUsername(auth0Id, newName);
            
            if (!updatedUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const auth0Id = authReq.auth?.payload.sub;

            if (!auth0Id) {
                res.status(401).json({ error: 'Unauthorized - No auth0Id' });
                return;
            }

            const result = await this.userService.deleteUser(auth0Id);
            
            if (!result) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}