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

    async sendInviteEmail(email: string, name: string): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            const frontendUrl = 'https://boka-bastu.vercel.app';
            const inviteLink = `${frontendUrl}/accept-invite`;

            const result = await this.transporter.sendMail({
                from: `"Sauna Booking" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: `You\'ve Been Invited to ${name}!`,
                html: `
                    <h1>Sauna Invitation</h1>
                    <p>You've been invited to join a sauna.</p>
                    <p>Click the link below to join:</p>
                    <a href="${inviteLink}">
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

    async sendInviteWithdrawEmail(email: string, name: string): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            const result = await this.transporter.sendMail({
                from: `"Sauna Booking" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'You\'re Invite Has Been Withdrawn!',
                html: `
                    <h1>Sauna Invite Has Been Withdrawn!</h1>
                    <p>The admin for ${name} has withdrawn your invitation.</p>
                    <p>Please contact your BRF to get a new invitation.</p>
                `
            });
            console.log('Email sent:', result);
        } catch (error) {
            console.error('Detailed email error:', error);
            throw error;
        }
    }

    async sendInviteAcceptedEmail(email: string, name: string): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            const result = await this.transporter.sendMail({
                from: `"Sauna Booking" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: `Welcome to ${name}!`,
                html: `
                    <h1>You've successfully accepted your invitation!</h1>
                    <p>Find all details about booking under "My Saunas" after logging in.</p>
                `
            });
            console.log('Email sent:', result);
        } catch (error) {
            console.error('Detailed email error:', error);
            throw error;
        }
    }

    async sendAccessRemovedEmail(email: string, saunaName: string): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            const result = await this.transporter.sendMail({
                from: `"Sauna Membership Removal" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: `You have been removed from ${saunaName}!`,
                html: `
                    <h1> ${saunaName}'s admin has removed you from ${saunaName}!</h1>
                    <p>Contact the admin for more details.</p>
                `
            });
            console.log('Email sent:', result);
        } catch (error) {
            console.error('Detailed email error:', error);
            throw error;
        }
    }
}