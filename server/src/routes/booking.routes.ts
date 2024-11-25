import { Router } from 'express';
import { Container } from 'typedi';
import { BookingController } from '../controllers/BookingController';
import { checkJwt } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();
const bookingController = Container.get(BookingController);

router.use(checkJwt);

router.post('/', bookingController.createBooking as RequestHandler);
router.get('/', bookingController.getBookings as RequestHandler);
router.patch('/:bookingId/status', bookingController.updateBookingStatus as RequestHandler);

export default router;