import { Service } from 'typedi';
import { User, IUser, UserDTO } from '../models/User';

@Service()
export class UserRepository {
    async findByAuth0Id(auth0Id: string): Promise<IUser | null> {
        return User.findOne({ auth0Id });
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