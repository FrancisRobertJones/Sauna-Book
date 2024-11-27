import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const InviteStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    EXPIRED: 'expired'
} as const;

export type InviteStatusType = typeof InviteStatus[keyof typeof InviteStatus];

export const CreateInviteSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    saunaId: z.string({ required_error: "Sauna ID is required" })
});

export type CreateInviteDTO = z.infer<typeof CreateInviteSchema>;

export const FullInviteSchema = z.object({
    email: z.string().email(),
    saunaId: z.string(),
    status: z.enum([InviteStatus.PENDING, InviteStatus.ACCEPTED, InviteStatus.EXPIRED])
        .default(InviteStatus.PENDING),
    invitedBy: z.string(),
    expiresAt: z.date().default(() => new Date(Date.now() + SEVEN_DAYS_MS))
});

const inviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    saunaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sauna',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(InviteStatus),
        default: InviteStatus.PENDING
    },
    invitedBy: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + SEVEN_DAYS_MS)
    }
}, {
    timestamps: true
});

export interface IInvite extends Document<mongoose.Types.ObjectId> {
    email: string;
    saunaId: mongoose.Types.ObjectId;
    status: InviteStatusType;
    invitedBy: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const Invite = mongoose.models.Invite || mongoose.model<IInvite>('Invite', inviteSchema);