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
import reminderRoutes from './routes/reminder.routes';
import webhookRoutes from './routes/webhook.routes';


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

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});


app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://boka-bastu.vercel.app',
  'https://sauna-book.xyz'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

const baseAuth = [checkJwt, linkUser, attachUserStatus];

app.use(helmet());
app.use(express.json());

if (process.env.TZ) {
  console.log(`Server timezone set to: ${process.env.TZ}`);
} else {
  process.env.TZ = 'Europe/Stockholm';
  console.log('Defaulting server timezone to Europe/Stockholm');
}

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.log('Server continuing without MongoDB connection');
  });

app.use('/api/users', baseAuth, userRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/saunas', baseAuth, saunaRoutes);
app.use('/api/reminder', baseAuth, reminderRoutes);
app.use('/api/adminbooking', [...baseAuth, requireAdmin], adminRoutes)
app.use('/api/bookings', [
  ...baseAuth,
  requireUser,
  requireNoPendingInvites,
  requireSaunaMembership
], bookingRoutes);
app.use('/api/invite', baseAuth, inviteRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

const PORT = config.port;

const server = app.listen(PORT as number, '0.0.0.0', () => {
  console.log('=== Server Starting ===');
  console.log(`Attempting to listen on PORT: ${PORT}`);
  console.log(`PORT environment variable: ${process.env.PORT}`);
  console.log(`config.port value: ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`MongoDB URI exists: ${!!config.mongoUri}`);
  console.log('=== Server Started ===');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

export default app;