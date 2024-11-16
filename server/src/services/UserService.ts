import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { IUser, UserDTO, UserSchema } from '../models/User';
import { ApplicationError } from '../utils/errors';

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

        const updatedUser = await this.userRepository.update(id, validatedData);
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
}