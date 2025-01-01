import { Service } from 'typedi';
import nodemailer from 'nodemailer';
import { IBooking } from '../models/Booking';
import { format } from 'date-fns';


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
            const frontendUrl = 'https://sauna-book.xyz';
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

    async sendBookingReminderEmail(email: string, booking: IBooking, saunaName: string): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            const bookingTime = new Date(booking.startTime);
            const result = await this.transporter.sendMail({
                from: `"Sauna Booking" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Upcoming Sauna Booking Reminder',
                html: `
                    <h1>Reminder: Your Sauna Booking is Soon!</h1>
                    <p>Your booking at ${saunaName} starts in 1 hour.</p>
                    <p>Details:</p>
                    <ul>
                        <li>Date: ${bookingTime.toLocaleDateString()}</li>
                        <li>Time: ${bookingTime.toLocaleTimeString()}</li>
                    </ul>
                    <p>Enjoy your sauna session!</p>
                `
            });
            console.log('Reminder email sent:', result);
        } catch (error) {
            console.error('Detailed email error:', error);
            throw error;
        }
    }

    async sendWaitlistNotification(email: string, slotTime: Date, saunaName: string): Promise<void> {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }

        const formattedTime = format(slotTime, 'PPpp'); 

        try {
            const result = await this.transporter.sendMail({
                from: `"Sauna Booking" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'A Slot is Available!',
                html: `
                    <h1>A Slot is Now Available!</h1>
                    <p>Good news! A slot you were waiting for at ${saunaName} has become available.</p>
                    <p>Time: ${formattedTime}</p>
                    <p>Please log in to the booking system to secure your slot.</p>
                    <p>Note: This slot may be booked by others if you don't act quickly.</p>
                `
            });
            console.log('Waitlist notification email sent:', result);
        } catch (error) {
            console.error('Detailed email error:', error);
            throw new Error('Failed to send waitlist notification email');
        }
    }

}