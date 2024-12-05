import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config/config';
import userRoutes from './routes/user.routes';
import saunaRoutes from './routes/sauna.routes';
import bookingRoutes from './routes/booking.routes';
import inviteRoutes from './routes/invite.routes';
import adminRoutes from './routes/admin.routes';

import {
  checkJwt,
  linkUser,
  attachUserStatus,
  requireAdmin,
  requireUser,
  requireNoPendingInvites,
  requireSaunaMembership
} from './middleware/auth.middleware';


const app = express();
const baseAuth = [checkJwt, linkUser, attachUserStatus];


app.use(cors());
app.use(helmet());
app.use(express.json());

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});



const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/users', baseAuth, userRoutes);
app.use('/api/saunas', baseAuth, saunaRoutes);
app.use('/api/adminbooking', [...baseAuth, requireAdmin], adminRoutes)
app.use('/api/bookings', [
  ...baseAuth,
  requireUser,
  requireNoPendingInvites,
  requireSaunaMembership
], bookingRoutes);

app.use('/api/invite', baseAuth, inviteRoutes);



export default app;