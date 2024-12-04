import { RequestHandler, Router } from "express";
import { BookingController } from "../controllers/BookingController";
import { linkUser } from "../middleware/auth.middleware";
import { checkJwt } from "../middleware/auth.middleware";
import Container from "typedi";

const router = Router();
const bookingController = Container.get(BookingController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);

router.get(
    '/sauna/:saunaId/all-bookings', bookingController.getAllSaunaBookings as RequestHandler
  );

export default router;
