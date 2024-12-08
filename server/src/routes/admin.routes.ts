import { RequestHandler, Router } from "express";
import { BookingController } from "../controllers/BookingController";
import { linkUser } from "../middleware/auth.middleware";
import { checkJwt } from "../middleware/auth.middleware";
import Container from "typedi";
import { SaunaController } from "../controllers/SaunaController";

const router = Router();
const bookingController = Container.get(BookingController);
const saunaController = Container.get(SaunaController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);

router.get(
  '/sauna/:saunaId/all-bookings', bookingController.getAllSaunaBookings as RequestHandler
);
router.get(
  '/sauna/:saunaId/users',
  bookingController.getSaunaUsers as RequestHandler
);

router.put(
  '/sauna/:saunaId/settings', 
  ((req, res, next) => saunaController.updateSettings(req, res, next)) as RequestHandler
);

router.get(
  '/:bookingId/user',
  bookingController.getSaunaUserFromBooking as RequestHandler
);


router.delete('/sauna/:saunaId/users/:userId', ((req, res) => saunaController.removeSaunaAccess(req, res)) as RequestHandler);

export default router;
