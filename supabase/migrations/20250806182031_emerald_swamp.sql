/*
  # Create loans table

  1. New Tables
    - `loans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text)
      - `amount` (numeric)
      - `outstanding` (numeric)
      - `interest_rate` (numeric)
      - `monthly_payment` (numeric)
      - `status` (text, check constraint)
      - `disbursed_date` (date)
      - `maturity_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `loans` table
    - Add policies for users to read their own loans
*/

CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  amount numeric(15,2) NOT NULL CHECK (amount > 0),
  outstanding numeric(15,2) NOT NULL CHECK (outstanding >= 0),
  interest_rate numeric(5,2) NOT NULL CHECK (interest_rate >= 0),
  monthly_payment numeric(15,2) NOT NULL CHECK (monthly_payment >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'pending', 'rejected')),
  disbursed_date date,
  maturity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own loans"
  ON loans
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert loan applications"
  ON loans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own loans"
  ON loans
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);