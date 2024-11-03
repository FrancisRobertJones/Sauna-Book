import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { UserDTO, UserSchema } from '../models/User';
import { ApplicationError } from '../utils/errors';

@Service()
export class UserService {
    constructor(
        private userRepository: UserRepository
    ) {}

    async createUser(userData: UserDTO) {
        const validatedData = UserSchema.parse(userData);
        
        const existingUser = await this.userRepository.findByEmail(validatedData.email);
        if (existingUser) {
            throw new ApplicationError('User already exists', 400);
        }

        return this.userRepository.create(validatedData);
    }

    async getUser(id: string) {
        const user = await this.userRepository.findById(id);
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
}