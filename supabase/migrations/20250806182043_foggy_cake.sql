/*
  # Create savings goals table

  1. New Tables
    - `savings_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `target_amount` (numeric)
      - `current_amount` (numeric, default 0)
      - `target_date` (date)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `savings_goals` table
    - Add policies for users to manage their own goals
*/

CREATE TABLE IF NOT EXISTS savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount numeric(15,2) NOT NULL CHECK (target_amount > 0),
  current_amount numeric(15,2) DEFAULT 0 CHECK (current_amount >= 0),
  target_date date NOT NULL,
  category text NOT NULL CHECK (category IN ('emergency', 'business', 'education', 'housing', 'other')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own savings goals"
  ON savings_goals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own savings goals"
  ON savings_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own savings goals"
  ON savings_goals
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own savings goals"
  ON savings_goals
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_savings_goals_updated_at
  BEFORE UPDATE ON savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);