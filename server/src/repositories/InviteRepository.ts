import { Service } from 'typedi';
import { Invite, IInvite, InviteStatus, InviteStatusType } from '../models/Invite';
import mongoose from 'mongoose';

@Service()
export class InviteRepository {
    async create(inviteData: {
        email: string;
        saunaId: string;
        invitedBy: string;
        status: InviteStatusType;
        expiresAt: Date;
    }): Promise<IInvite> {
        const invite = new Invite(inviteData);
        return invite.save();
    }

    async findById(id: string): Promise<IInvite | null> {
        return Invite.findById(id).populate('saunaId', 'name');
    }

    async updateStatus(inviteId: string, status: InviteStatusType): Promise<IInvite | null> {
        return Invite.findByIdAndUpdate(
            inviteId,
            { status },
            { new: true }  
        ).populate('saunaId', 'name');
    }

    async findBySauna(saunaId: string): Promise<IInvite[]> {
        return Invite.find({
            saunaId: new mongoose.Types.ObjectId(saunaId)
        }).sort({ createdAt: -1 });
    }

    async markExpired(): Promise<void> {
        await Invite.updateMany(
            {
                status: InviteStatus.PENDING,
                expiresAt: { $lt: new Date() }
            },
            {
                status: InviteStatus.EXPIRED
            }
        );
    }

    async findByIdUnpopulated(inviteId: string): Promise<IInvite | null> {
        return Invite.findById(inviteId).exec();
    }

    async findByInviter(invitedBy: string): Promise<IInvite[]> {
        return Invite.find({ invitedBy })
            .sort({ createdAt: -1 })
            .populate('saunaId', 'name');
    }
    

    async findPendingInvitesByEmail(email: string): Promise<IInvite[]> {
        return Invite.find({
            email,
            status: InviteStatus.PENDING,
            expiresAt: { $gt: new Date() }
        })
        .populate('saunaId', 'name')  
        .sort({ createdAt: -1 });
    }
    
    async countPendingInvites(email: string): Promise<number> {
        return Invite.countDocuments({
            email,
            status: InviteStatus.PENDING,
            expiresAt: { $gt: new Date() }
        });
    }
}