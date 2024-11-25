import { Router } from 'express';
import { Container } from 'typedi';
import { InviteController } from '../controllers/InviteController';
import { checkJwt } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();
const inviteController = Container.get(InviteController);

router.use(checkJwt);

router.post('/', inviteController.createInvite as RequestHandler);
router.get('/sauna/:saunaId', inviteController.getInvitesBySauna as RequestHandler);
router.delete('/:inviteId', inviteController.cancelInvite as RequestHandler);
router.post('/process', inviteController.processInvites as RequestHandler);

export default router;