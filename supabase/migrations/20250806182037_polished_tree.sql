/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text, check constraint)
      - `category` (text)
      - `amount` (numeric)
      - `description` (text)
      - `reference` (text, unique)
      - `status` (text, check constraint)
      - `balance_after` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for users to read their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payment', 'fee')),
  category text NOT NULL,
  amount numeric(15,2) NOT NULL,
  description text NOT NULL,
  reference text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
  balance_after numeric(15,2),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Function to generate transaction reference
CREATE OR REPLACE FUNCTION generate_transaction_reference(tx_type text)
RETURNS text AS $$
BEGIN
  RETURN upper(tx_type) || '-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('transaction_ref_seq')::text, 6, '0');
END;
$$ language 'plpgsql';

-- Create sequence for transaction references
CREATE SEQUENCE IF NOT EXISTS transaction_ref_seq START 1;