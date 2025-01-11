import { db } from '../../db';
import { transactions, wallets } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';
import { TransactionType, Provider } from '../../types';
import { parseNumeric, toNumeric } from '../../utils/numeric';

export const createTransaction = async ({
  userId,
  type,
  amount,
  networkId,
  dataPlanId,
  phoneNumber,
  provider,
  metadata,
}: {
  userId: string;
  type: TransactionType;
  amount: number;
  networkId?: string;
  dataPlanId?: string;
  phoneNumber?: string;
  provider?: Provider;
  metadata?: string;
}) => {
  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet) {
    throw new NotFoundError('Wallet not found');
  }

  const currentBalance = parseNumeric(wallet.balance);
  if (currentBalance < amount) {
    throw new Error('Insufficient balance');
  }

  return db.transaction(async (tx) => {
    // Create transaction record
    const [transaction] = await tx
      .insert(transactions)
      .values({
        userId,
        type,
        amount: toNumeric(amount),
        networkId,
        dataPlanId,
        phoneNumber,
        provider,
        metadata,
      })
      .returning();

    // Update wallet balance
    await tx
      .update(wallets)
      .set({ 
        balance: toNumeric(currentBalance - amount),
        updatedAt: new Date()
      })
      .where(eq(wallets.id, wallet.id));

    return transaction;
  });
};