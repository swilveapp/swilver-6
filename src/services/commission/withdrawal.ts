import { db } from '../../db';
import { transactions, wallets } from '../../db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { BadRequestError } from '../../utils/errors';
import { parseNumeric, toNumeric } from '../../utils/numeric';

export const createWithdrawalRequest = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) => {
  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet || parseNumeric(wallet.commissionBalance) < amount) {
    throw new BadRequestError('Insufficient commission balance');
  }

  return db.transaction(async (tx) => {
    // Create withdrawal transaction
    const [transaction] = await tx
      .insert(transactions)
      .values({
        userId,
        type: 'commission_withdrawal',
        amount: toNumeric(amount),
        status: 'pending',
      })
      .returning();

    // Update wallet commission balance
    await tx
      .update(wallets)
      .set({ 
        commissionBalance: toNumeric(parseNumeric(wallet.commissionBalance) - amount),
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));

    return transaction;
  });
};

export const getWithdrawalHistory = async ({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) => {
  return db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.type, 'commission_withdrawal')
    ),
    orderBy: desc(transactions.createdAt),
    limit,
    offset,
  });
};