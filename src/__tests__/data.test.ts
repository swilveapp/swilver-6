import request from 'supertest';
import app from '../server';
import { db } from '../db';
import { users, wallets, networks, dataPlans } from '../db/schema';
import { generateToken } from '../services/auth/token';

jest.mock('../services/providers/vtpass');
jest.mock('../services/providers/gladtidings');

describe('Data', () => {
  let authToken: string;
  let userId: string;
  let networkId: string;
  let planId: string;

  beforeEach(async () => {
    // Clean up tables
    await db.delete(dataPlans);
    await db.delete(wallets);
    await db.delete(networks);
    await db.delete(users);

    // Create test user
    const [user] = await db
      .insert(users)
      .values({
        email: 'test@example.com',
        password: 'hashedpassword',
        fullName: 'Test User',
        phone: '2348012345678',
      })
      .returning();

    userId = user.id;
    authToken = generateToken({ userId: user.id, role: user.role });

    // Create test wallet
    await db.insert(wallets).values({
      userId: user.id,
      balance: 1000,
    });

    // Create test network
    const [network] = await db
      .insert(networks)
      .values({
        name: 'MTN',
        code: 'mtn',
        dataDiscount: 5,
      })
      .returning();

    networkId = network.id;

    // Create test data plan
    const [plan] = await db
      .insert(dataPlans)
      .values({
        networkId: network.id,
        name: '1GB Data',
        code: 'mtn-1gb',
        price: 300,
        validity: '30 days',
        size: '1GB',
        type: 'sme',
      })
      .returning();

    planId = plan.id;
  });

  describe('GET /api/data/plans/:networkId', () => {
    it('should return data plans for network', async () => {
      const res = await request(app)
        .get(`/api/data/plans/${networkId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].networkId).toBe(networkId);
    });
  });

  describe('POST /api/data/purchase', () => {
    it('should purchase data plan successfully', async () => {
      const res = await request(app)
        .post('/api/data/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '2348012345678',
          planId,
          networkId,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.transactionId).toBeDefined();
    });

    it('should return error for insufficient balance', async () => {
      // Update plan price to be more than wallet balance
      await db
        .update(dataPlans)
        .set({ price: 2000 })
        .where(eq(dataPlans.id, planId));

      const res = await request(app)
        .post('/api/data/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '2348012345678',
          planId,
          networkId,
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
});