import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  national_id: string
  occupation: string
  member_id: string
  created_at: string
  updated_at: string
}

export interface SavingsAccount {
  id: string
  user_id: string
  name: string
  balance: number
  interest_rate: number
  type: 'regular' | 'emergency' | 'business'
  monthly_contribution: number
  created_at: string
  updated_at: string
}

export interface Loan {
  id: string
  user_id: string
  type: string
  amount: number
  outstanding: number
  interest_rate: number
  monthly_payment: number
  status: 'active' | 'completed' | 'pending'
  disbursed_date: string
  maturity_date: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'payment' | 'fee'
  category: string
  amount: number
  description: string
  reference: string
  status: 'completed' | 'pending' | 'failed'
  balance_after: number
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string
  category: string
  created_at: string
  updated_at: string
}