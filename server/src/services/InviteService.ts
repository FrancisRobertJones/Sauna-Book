import { Service } from 'typedi';
import { InviteRepository } from '../repositories/InviteRepository';
import { UserService } from './UserService';
import { SaunaService } from './SaunaService';
import { IInvite, InviteStatus } from '../models/Invite';
import { ApplicationError } from '../utils/errors';
import { EmailService } from './EmailService';

const SEVEN_DAYS_FROM_CREATION = Date.now() + 7 * 24 * 60 * 60 * 1000;


@Service()
export class InviteService {
   constructor(
       private inviteRepository: InviteRepository,
       private userService: UserService,
       private saunaService: SaunaService,
       private emailService: EmailService
    ) {}

    async createInvite(saunaId: string, email: string, invitedBy: string): Promise<IInvite> {
        const sauna = await this.saunaService.findById(saunaId);
        console.log(sauna, "this is the sauna >>>>>>>")
        if (!sauna) {
            throw new ApplicationError('Sauna not found', 404);
        }

        if (sauna.adminId !== invitedBy) {
            throw new ApplicationError('Not authorized to invite to this sauna', 403);
        }

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser && existingUser.saunaAccess.includes(saunaId)) {
            throw new ApplicationError('User already has access to this sauna', 400);
        }

        const pendingInvites = await this.inviteRepository.findByInviter(email);
        const hasExistingInvite = pendingInvites.some(invite => 
            invite.saunaId.toString() === saunaId
        );
        
        if (hasExistingInvite) {
            throw new ApplicationError('User already has a pending invite', 400);
        }

        const inviteData = {
            email,
            saunaId,
            invitedBy,
            status: InviteStatus.PENDING,
            expiresAt: new Date(Date.now() + SEVEN_DAYS_FROM_CREATION)
        };

        const invite = await this.inviteRepository.create(inviteData);

        await this.emailService.sendInviteEmail(email, invite);

        return invite;
    }

    async processUserInvites(email: string, userId: string): Promise<void> {
        try {
            const pendingInvites = await this.inviteRepository.findPendingByEmail(email);
     
            for (const invite of pendingInvites) {
                try {
                    await this.userService.addSaunaAccess(
                        userId, 
                        invite.saunaId.toString()
                    );
     
                    await this.inviteRepository.updateStatus(
                        invite._id.toString(), 
                        InviteStatus.ACCEPTED
                    );
                } catch (error) {
                    console.error(`Failed to process invite ${invite._id}:`, error);
                }
            }
        } catch (error) {
            throw new ApplicationError('Failed to process invites', 500);
        }
     }

   async getInvitesBySauna(saunaId: string, adminId: string): Promise<IInvite[]> {
       const sauna = await this.saunaService.findById(saunaId);
       console.log("WE ARE I NGET INVITES BY SAUNA >>>>>>>>>", sauna)
       if (!sauna || sauna.adminId !== adminId) {
           throw new ApplicationError('Not authorized to view invites', 403);
       }

       return this.inviteRepository.findBySauna(saunaId);
   }

   async cancelInvite(inviteId: string, adminId: string): Promise<IInvite> {
       const invite = await this.inviteRepository.findById(inviteId);
       if (!invite) {
           throw new ApplicationError('Invite not found', 404);
       }

       const sauna = await this.saunaService.findById(invite.saunaId.toString());
       if (!sauna || sauna.adminId !== adminId) {
           throw new ApplicationError('Not authorized to cancel invite', 403);
       }

       if (invite.status !== InviteStatus.PENDING) {
           throw new ApplicationError('Invite cannot be cancelled', 400);
       }

       const updatedInvite = await this.inviteRepository.updateStatus(
           inviteId,
           InviteStatus.EXPIRED
       );

       if (!updatedInvite) {
           throw new ApplicationError('Failed to cancel invite', 500);
       }

       await this.emailService.sendInviteEmail(invite.email, invite);

       return updatedInvite;
   }

   //TODOFJ RUN THIS AS CRONJOB IN FUTURE 
   async cleanupExpiredInvites(): Promise<void> {
       await this.inviteRepository.markExpired();
   }
}