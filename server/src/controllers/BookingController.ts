// src/controllers/BookingController.ts
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { BookingService } from '../services/BookingService';
import { AuthRequest } from '../types/auth.types';
import { RequestHandler } from 'express';
import { BookingSchema } from '../models/Booking';

@Service()
export class BookingController {
    constructor(private bookingService: BookingService) { }

    createBooking: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.auth?.payload.sub;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const bookingData = BookingSchema.parse({
                ...req.body,
                userId,
                startTime: new Date(req.body.startTime),
                endTime: new Date(req.body.endTime)
            });

            const booking = await this.bookingService
                .createBooking(bookingData);

            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    };

    getBookings: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { saunaId, date } = req.query;

            if (!saunaId || !date) {
                res.status(400).json({ error: 'Missing required parameters' });
                return;
            }

            const bookings = await this.bookingService
                .getBookingsForDate(
                    saunaId as string,
                    new Date(date as string)
                );

            res.json(bookings);
        } catch (error) {
            next(error);
        }
    };

    updateBookingStatus: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.auth?.payload.sub;
            const { bookingId } = req.params;
            const { status } = req.body;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const booking = await this.bookingService
                .updateBookingStatus(bookingId, userId, status);

            res.json(booking);
        } catch (error) {
            next(error);
        }
    };
}