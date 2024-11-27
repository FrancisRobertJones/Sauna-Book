export interface Invite {
    _id: string;
    email: string;
    saunaId: string | {
        _id: string;
        name: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    invitedBy: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface PendingInvite extends Omit<Invite, 'saunaId'> {
    saunaId: {
        _id: string;
        name: string;
    };
}