import { Service } from 'typedi';
import { User, IUser, UserDTO } from '../models/User';

@Service()
export class UserRepository {
    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async create(userData: UserDTO): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async update(id: string, userData: Partial<UserDTO>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
}