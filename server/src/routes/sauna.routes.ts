import { Router } from 'express';
import { Container } from 'typedi';
import { SaunaController } from '../controllers/SaunaController';
import { checkJwt, linkUser } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();
const saunaController = Container.get(SaunaController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);

router.post('/', saunaController.createSauna as RequestHandler);
router.get('/:id', saunaController.getSauna as RequestHandler);

export default router;