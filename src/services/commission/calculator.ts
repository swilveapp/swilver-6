import { db } from '../../db';
import { commissionRates } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { UserRole } from '../../types';
import { parseNumeric, toNumeric } from '../../utils/numeric';

export const calculateCommission = async ({
  userRole,
  networkId,
  serviceType,
  amount,
}: {
  userRole: UserRole;
  networkId: string;
  serviceType: string;
  amount: number;
}) => {
  const rate = await db.query.commissionRates.findFirst({
    where: and(
      eq(commissionRates.userRole, userRole),
      eq(commissionRates.networkId, networkId),
      eq(commissionRates.serviceType, serviceType)
    ),
  });

  if (!rate) {
    return 0;
  }

  const rateValue = parseNumeric(rate.rate);
  return (amount * rateValue) / 100;
};