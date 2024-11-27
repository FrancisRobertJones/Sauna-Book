import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { IUser, UserDTO, UserSchema } from '../models/User';
import { ApplicationError } from '../utils/errors';
import mongoose from 'mongoose';

@Service()
export class UserService {
    constructor(
        private userRepository: UserRepository
    ) { }

    async findOrCreateUser(auth0Id: string, email: string, name: string): Promise<IUser> {
        let user = await this.userRepository.findByAuth0Id(auth0Id);

        if (!user) {
            user = await this.userRepository.create({
                auth0Id,
                email,
                name,
                role: 'user',
                saunaAccess: []
            });
            console.log('Created new user:', user);
        }

        return user;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findByEmail(email);
    }


    async findByAuth0Id(auth0Id: string): Promise<IUser | null> {
        return this.userRepository.findByAuth0Id(auth0Id);
    }

    async getUser(id: string) {
        const user = await this.userRepository.findByAuth0Id(id);
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }
        return user;
    }

    async updateUser(id: string, userData: Partial<UserDTO>) {
        const validatedData = UserSchema.partial().parse(userData);
        
        const userDataToUpdate = {
            ...validatedData,
            saunaAccess: validatedData.saunaAccess?.map(id => 
                new mongoose.Types.ObjectId(id)
            )
        };

        const updatedUser = await this.userRepository.update(id, userDataToUpdate as Partial<IUser>);
        if (!updatedUser) {
            throw new ApplicationError('User not found', 404);
        }
        return updatedUser;
    } 

    async updateRole(auth0Id: string, role: 'admin' | 'user'): Promise<void> {
        const user = await this.userRepository.findByAuth0Id(auth0Id);

        if (!user) {
            throw new Error('User not found');
        }

        await this.userRepository.updateRole(auth0Id, role);
    }

    async addSaunaAccess(userId: string, saunaId: string): Promise<IUser | null> {
        const user = await this.userRepository.findByAuth0Id(userId);
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }


        if (!user.saunaAccess.map(id => id.toString()).includes(saunaId)) {
            user.saunaAccess.push(new mongoose.Types.ObjectId(saunaId));
            return this.userRepository.update(user._id.toString(), { saunaAccess: user.saunaAccess });
        }


        return user;
    }

    async hasAccessToSauna(userId: string, saunaId: string): Promise<boolean> {
        const user = await this.userRepository.findByAuth0Id(userId);
        if (!user) return false;

        const userSaunaIds = user.saunaAccess.map(id => id.toString());
        return userSaunaIds.includes(saunaId);
    }
}