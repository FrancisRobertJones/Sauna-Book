import { Router } from 'express';
import { Container } from 'typedi';
import { RequestHandler } from 'express';
import { WebhookController } from '../controllers/WebhookController';

const router = Router();
const webhookController = Container.get(WebhookController);

router.post('/notifications/send', webhookController.handleNotification as RequestHandler);

export default router;