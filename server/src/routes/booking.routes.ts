import { Router } from 'express';
import { Container } from 'typedi';
import { BookingController } from '../controllers/BookingController';
import { checkJwt, linkUser } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();
const bookingController = Container.get(BookingController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);



router.get(
  '/available-slots/:saunaId',
  bookingController.getAvailableSlots as RequestHandler
);

router.get(
  '/my-bookings',
  bookingController.getUserBookings as RequestHandler
);

router.get(
  '/user-bookings-count/:saunaId',
  bookingController.getUserBookingsCount as RequestHandler
)

router.post(
  '/',
  bookingController.createBooking as RequestHandler
);

router.post(
  '/:bookingId/cancel',
  bookingController.cancelBooking as RequestHandler
);

router.get(
  '/:bookingId',
  bookingController.getBooking as RequestHandler
);


router.get(
  '/sauna/:saunaId',
  bookingController.getSaunaBookings as RequestHandler
);

export default router;