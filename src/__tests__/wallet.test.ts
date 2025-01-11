import request from 'supertest';
import app from '../server';
import { db } from '../db';
import { users, wallets } from '../db/schema';
import { generateToken } from '../services/auth/token';

describe('Wallet', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    await db.delete(wallets);
    await db.delete(users);

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

    await db.insert(wallets).values({
      userId: user.id,
      balance: 1000,
      commissionBalance: 100,
    });
  });

  describe('GET /api/wallet/balance', () => {
    it('should return wallet balance for authenticated user', async () => {
      const res = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.balance).toBe('1000');
      expect(res.body.data.commissionBalance).toBe('100');
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app).get('/api/wallet/balance');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/wallet/fund', () => {
    it('should fund wallet successfully', async () => {
      const res = await request(app)
        .post('/api/wallet/fund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 500,
          reference: 'test_ref_123',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.balance).toBe('1500');
    });

    it('should return error for invalid amount', async () => {
      const res = await request(app)
        .post('/api/wallet/fund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -100,
          reference: 'test_ref_123',
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
});