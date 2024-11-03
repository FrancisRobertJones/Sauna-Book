import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '../controllers/UserController';
import { checkJwt, linkUser } from '../middleware/auth.middleware';
import { RequestHandler } from 'express';  


const router = Router();
const userController = Container.get(UserController);

router.use(checkJwt);
router.use(linkUser as RequestHandler);

router.get('/me', userController.getCurrentUser as RequestHandler);


export default router;