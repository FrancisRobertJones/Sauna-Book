import { Service } from 'typedi';
import nodemailer from 'nodemailer';
import { IInvite } from '../models/Invite';

@Service()
export class EmailService {
    private transporter;

    constructor() {
        console.log('Email Config:', {
            hasUser: !!process.env.GMAIL_USER,
            hasPassword: !!process.env.GMAIL_APP_PASSWORD,
            user: process.env.GMAIL_USER 
        });

        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            throw new Error('Missing email configuration');
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
    }

    async sendInviteEmail(email: string, invite: IInvite): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            const result = await this.transporter.sendMail({
                from: `"Sauna Booking" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'You\'ve Been Invited to a Sauna!',
                html: `
                    <h1>Sauna Invitation</h1>
                    <p>You've been invited to join a sauna.</p>
                    <p>Click the link below to join:</p>
                    <a href="${process.env.FRONTEND_URL}/accept-invite?id=${invite._id}">
                        Accept Invitation
                    </a>
                `
            });
            console.log('Email sent:', result);
        } catch (error) {
            console.error('Detailed email error:', error);
            throw error;
        }
    }
}