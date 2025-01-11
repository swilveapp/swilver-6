import { db } from '../../db';
import { wallets } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';
import { parseNumeric, toNumeric } from '../../utils/numeric';

export const getWalletBalance = async (userId: string) => {
  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet) {
    throw new NotFoundError('Wallet not found');
  }

  return {
    balance: wallet.balance,
    commissionBalance: wallet.commissionBalance,
  };
};

export const updateWalletBalance = async (
  userId: string,
  amount: number,
  type: 'credit' | 'debit'
) => {
  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });

  if (!wallet) {
    throw new NotFoundError('Wallet not found');
  }

  const currentBalance = parseNumeric(wallet.balance);
  const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;

  if (newBalance < 0) {
    throw new Error('Insufficient balance');
  }

  await db
    .update(wallets)
    .set({ 
      balance: toNumeric(newBalance), 
      lastFundedAt: type === 'credit' ? new Date() : undefined,
      updatedAt: new Date()
    })
    .where(eq(wallets.id, wallet.id));

  return { balance: toNumeric(newBalance) };
};