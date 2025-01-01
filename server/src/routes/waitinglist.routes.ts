import { Router } from 'express';
import { Container } from 'typedi';
import { WaitingListController } from '../controllers/WaitingListController';
import { checkJwt, linkUser } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();
const waitingListController = Container.get(WaitingListController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);

router.get(
    '/:saunaId/status',
    waitingListController.getWaitlistStatus as RequestHandler
);

router.post(
    '/:saunaId',
    waitingListController.addToWaitlist as RequestHandler
);

router.delete(
    '/:saunaId',
    waitingListController.removeFromWaitlist as RequestHandler
);

export default router;