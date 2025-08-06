/*
  # Create savings accounts table

  1. New Tables
    - `savings_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `balance` (numeric, default 0)
      - `interest_rate` (numeric, default 0)
      - `type` (text, check constraint)
      - `monthly_contribution` (numeric, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `savings_accounts` table
    - Add policies for users to manage their own accounts
*/

CREATE TABLE IF NOT EXISTS savings_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  balance numeric(15,2) DEFAULT 0 CHECK (balance >= 0),
  interest_rate numeric(5,2) DEFAULT 0 CHECK (interest_rate >= 0),
  type text NOT NULL CHECK (type IN ('regular', 'emergency', 'business')),
  monthly_contribution numeric(15,2) DEFAULT 0 CHECK (monthly_contribution >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE savings_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own savings accounts"
  ON savings_accounts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own savings accounts"
  ON savings_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own savings accounts"
  ON savings_accounts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own savings accounts"
  ON savings_accounts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_savings_accounts_updated_at
  BEFORE UPDATE ON savings_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_savings_accounts_user_id ON savings_accounts(user_id);