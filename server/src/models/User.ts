import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

export const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    saunaAccess: z.array(z.string()),  
    role: z.enum(['admin', 'user'])
});

export type UserDTO = z.infer<typeof UserSchema>;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
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

export interface IUser extends Document {
    email: string;
    name: string;
    saunaAccess: string[];
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
}

export const User = mongoose.model<IUser>('User', userSchema);