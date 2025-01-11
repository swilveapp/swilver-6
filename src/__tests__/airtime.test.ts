import request from 'supertest';
import app from '../server';
import { db } from '../db';
import { users, wallets, networks } from '../db/schema';
import { generateToken } from '../services/auth/token';

jest.mock('../services/providers/vtpass');
jest.mock('../services/providers/gladtidings');

describe('Airtime', () => {
  let authToken: string;
  let userId: string;
  let networkId: string;

  beforeEach(async () => {
    // Clean up tables
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
        airtimeDiscount: 3,
      })
      .returning();

    networkId = network.id;
  });

  describe('POST /api/airtime/purchase', () => {
    it('should purchase airtime successfully', async () => {
      const res = await request(app)
        .post('/api/airtime/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '2348012345678',
          amount: 100,
          networkId,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.transactionId).toBeDefined();
    });

    it('should return error for insufficient balance', async () => {
      const res = await request(app)
        .post('/api/airtime/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '2348012345678',
          amount: 2000,
          networkId,
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return error for invalid phone number', async () => {
      const res = await request(app)
        .post('/api/airtime/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '12345',
          amount: 100,
          networkId,
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
});