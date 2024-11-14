import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config/config';
import userRoutes from './routes/user.routes';
import saunaRoutes from './routes/sauna.routes';


const app = express();

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

app.use('/api/users', userRoutes);
app.use('/api/saunas', saunaRoutes);



export default app;