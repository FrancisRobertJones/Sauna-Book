import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

export const UserSchema = z.object({
    auth0Id: z.string(),
    email: z.string().email(),
    name: z.string().min(2),
    saunaAccess: z.array(z.string()),
    role: z.enum(['admin', 'user'])
});

export type UserDTO = z.infer<typeof UserSchema>;

export interface IUser extends Document<mongoose.Types.ObjectId> {
    auth0Id: string;
    email: string;
    name: string;
    role:'admin' | 'user';
    saunaAccess: mongoose.Types.ObjectId[]; 
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    auth0Id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    saunaAccess: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sauna'
    }],
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);