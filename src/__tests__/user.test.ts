import request from 'supertest';
import app from '../server';
import { db } from '../db';
import { users } from '../db/schema';
import { generateToken } from '../services/auth/token';

describe('User', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
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
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.email).toBe('test@example.com');
      expect(res.body.data.password).toBeUndefined();
    });
  });

  describe('PATCH /api/users/profile', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Name',
          phone: '2348087654321',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.fullName).toBe('Updated Name');
      expect(res.body.data.phone).toBe('2348087654321');
    });

    it('should return error for invalid email', async () => {
      const res = await request(app)
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'invalid-email',
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
});