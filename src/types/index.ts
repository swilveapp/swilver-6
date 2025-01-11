export type UserRole = 'admin' | 'mega_user' | 'reseller' | 'api_user';
export type TransactionType = 'airtime' | 'data' | 'wallet_funding' | 'commission_withdrawal';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type Provider = 'vtpass' | 'gladtidings';

export interface AuthUser {
  userId: string;
  role: UserRole;
  email: string;
}