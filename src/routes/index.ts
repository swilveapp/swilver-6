import { Express } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import walletRoutes from './wallet';
import airtimeRoutes from './airtime';
import dataRoutes from './data';
import adminRoutes from './admin';
import paymentRoutes from './payment';
import networkRoutes from './networks';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/wallet', walletRoutes);
  app.use('/api/airtime', airtimeRoutes);
  app.use('/api/data', dataRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/network', networkRoutes);
};
