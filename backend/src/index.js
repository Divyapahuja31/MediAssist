import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import deviceRoutes from './modules/device/device.routes.js';
import medicationRoutes from './modules/medication/medication.routes.js';
import scheduleRoutes from './modules/schedule/schedule.routes.js';
import prescriptionRoutes from './modules/prescription/prescription.routes.js';
import adherenceRoutes from './modules/adherence/adherence.routes.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('MediAssist API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/adherence', adherenceRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await disconnectDB();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
};

startServer(); 