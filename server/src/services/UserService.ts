import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { IUser, UserDTO, UserSchema } from '../models/User';
import { ApplicationError } from '../utils/errors';
import mongoose from 'mongoose';
import { SaunaRepository } from '../repositories/SaunaRepository';
import { EmailService } from './EmailService';
import { BookingRepository } from '../repositories/BookingRepository';
import { Booking } from '../models/Booking';
import { SaunaService } from './SaunaService';

@Service()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private saunaRepository: SaunaRepository,
        private emailService: EmailService,
        private bookingRepository: BookingRepository,
    ) { }

    async findUserByAuth0Id(auth0Id: string): Promise<IUser | null> {
        return this.userRepository.findByAuth0Id(auth0Id);
    }

    async createUser(auth0Id: string, email: string, name: string, role: 'admin' | 'user'): Promise<IUser> {
        const user = await this.userRepository.create({
            auth0Id,
            email,
            name,
            role,
            saunaAccess: []
        });
        console.log('Created new user:', user);
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

    async isSaunaMember(userId: string): Promise<boolean> {
        const user = await this.userRepository.findByAuth0Id(userId);
        if (!user) return false;

        return user.saunaAccess.length > 0;
    }

    async isAdmin(userId: string): Promise<boolean> {
        const user = await this.userRepository.findByAuth0Id(userId);
        return user?.role === 'admin' || false;
    }

    async findBySub(sub: string) {
        return this.userRepository.findByAuth0Id(sub);
    }

    async getUsersBySauna(saunaId: string, adminId: string): Promise<IUser[]> {
        const sauna = await this.saunaRepository.findById(saunaId);
        if (!sauna || sauna.adminId !== adminId) {
            throw new ApplicationError('Sauna not found or unauthorized', 404);
        }

        return this.userRepository.findBySaunaAccess(saunaId);
    }

    async removeSaunaAccess(userId: string, saunaId: string, adminId: string): Promise<IUser | null> {
        const sauna = await this.saunaRepository.findById(saunaId);
        if (!sauna || sauna.adminId !== adminId) {
            throw new ApplicationError('Sauna not found or unauthorized', 404);
        }
    
        const user = await this.userRepository.findByAuth0Id(userId);
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }
    
        user.saunaAccess = user.saunaAccess.filter(
            id => id.toString() !== saunaId
        );
    
        await this.bookingRepository.deleteFutureBookings(saunaId, userId);
        return user.save(); 
    }

    async removeSaunaAccessForAllUsers(saunaId: string): Promise<void> {
        const sauna = await this.saunaRepository.findById(saunaId);
        if (!sauna) {
          throw new ApplicationError('Sauna not found', 404);
        }
        
        await this.userRepository.removeSaunaAccessForAllUsers(saunaId);
      }

}