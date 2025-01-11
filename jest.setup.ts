import { db } from './src/db';

beforeAll(async () => {
  // Ensure database connection
  await db.execute(sql`SELECT 1`);
});

afterAll(async () => {
  // Close database connection
  const client = (db as any)._client;
  await client.end();
});