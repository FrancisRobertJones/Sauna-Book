import { Router } from 'express';
import { Container } from 'typedi';
import { checkJwt, linkUser } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';
import { ReminderController } from '../controllers/ReminderController';

const router = Router();
const reminderController = Container.get(ReminderController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);

router.post('/', reminderController.createReminder as RequestHandler);
router.delete('/:bookingId', reminderController.deleteReminder as RequestHandler);
router.get('/booking/:bookingId', reminderController.getReminderStatus as RequestHandler);

export default router;