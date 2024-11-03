// src/controllers/UserController.ts
import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserDTO } from '../models/User';

@Service()
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Received request body:', req.body); 
            const user = await this.userService.createUser(req.body as UserDTO);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.getUser(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}