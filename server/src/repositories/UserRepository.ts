import { Service } from 'typedi';
import { User, IUser, UserDTO } from '../models/User';

@Service()
export class UserRepository {
    async findByAuth0Id(auth0Id: string): Promise<IUser | null> {
        return User.findOne({ auth0Id });
      }

      async updateRole(auth0Id: string, role: 'admin' | 'user'): Promise<void> {
        const result = await User.updateOne(
            { auth0Id },
            { $set: { role } }
        );

        if (result.matchedCount === 0) {
            throw new Error('User not found');
        }
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