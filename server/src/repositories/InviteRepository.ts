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
       return Invite.findById(id);
   }

   async updateStatus(
       id: string, 
       status: typeof InviteStatus[keyof typeof InviteStatus]
   ): Promise<IInvite | null> {
       return Invite.findByIdAndUpdate(
           id,
           { status },
           { new: true }
       );
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

   async findByInviter(invitedBy: string): Promise<IInvite[]> {
       return Invite.find({ invitedBy })
           .sort({ createdAt: -1 })
           .populate('saunaId', 'name'); 
   }

   async findPendingByEmail(email: string): Promise<IInvite[]> {
    return Invite.find({
        email,
        status: InviteStatus.PENDING,
        expiresAt: { $gt: new Date() } 
    });
}
}