/*
  # Initial Database Schema

  1. Core Tables
    - users: User management and authentication
    - wallets: Balance tracking for users
    - networks: Telecom providers configuration
    - data_plans: Available data bundles
    - transactions: Transaction records
    - commissions: Commission tracking
    - commission_rates: Commission configuration

  2. Enums
    - user_role: User role types
    - plan_type: Data plan categories
    - transaction_type: Transaction categories
    - transaction_status: Status tracking
    - provider: VTU providers

  3. Security
    - RLS enabled on all tables
    - Role-based access policies
*/

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'mega_user', 'reseller', 'api_user');
CREATE TYPE plan_type AS ENUM ('sme', 'gifting', 'corporate');
CREATE TYPE transaction_type AS ENUM ('airtime', 'data', 'wallet_funding', 'commission_withdrawal');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE provider AS ENUM ('vtpass', 'gladtidings');

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  role user_role NOT NULL DEFAULT 'reseller',
  is_active boolean NOT NULL DEFAULT true,
  api_key text UNIQUE,
  api_secret text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  balance numeric(10,2) NOT NULL DEFAULT 0,
  commission_balance numeric(10,2) NOT NULL DEFAULT 0,
  last_funded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Networks
CREATE TABLE IF NOT EXISTS networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  logo text,
  is_active boolean NOT NULL DEFAULT true,
  airtime_discount numeric(5,2) NOT NULL DEFAULT 0,
  data_discount numeric(5,2) NOT NULL DEFAULT 0
);

-- Data Plans
CREATE TABLE IF NOT EXISTS data_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id uuid NOT NULL REFERENCES networks(id),
  name text NOT NULL,
  code text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  validity text NOT NULL,
  size text NOT NULL,
  type plan_type NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  fee numeric(10,2) NOT NULL DEFAULT 0,
  commission numeric(10,2) NOT NULL DEFAULT 0,
  network_id uuid REFERENCES networks(id),
  data_plan_id uuid REFERENCES data_plans(id),
  phone_number text,
  provider provider,
  provider_reference text,
  metadata text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Commissions
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  transaction_id uuid NOT NULL REFERENCES transactions(id),
  amount numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Commission Rates
CREATE TABLE IF NOT EXISTS commission_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_role user_role NOT NULL,
  network_id uuid NOT NULL REFERENCES networks(id),
  service_type text NOT NULL,
  rate numeric(5,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own wallet"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view active networks"
  ON networks
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view active data plans"
  ON data_plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own commissions"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_data_plans_network_id ON data_plans(network_id);
CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_commission_rates_network_id ON commission_rates(network_id);