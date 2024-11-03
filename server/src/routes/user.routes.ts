import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = Container.get(UserController);

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

export default router;