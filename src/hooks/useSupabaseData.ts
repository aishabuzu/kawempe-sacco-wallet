import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, SavingsAccount, Loan, Transaction, SavingsGoal } from '@/lib/supabase'

export const useSupabaseData = () => {
  const [user, setUser] = useState<User | null>(null)
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setLoading(false)
        return
      }

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userError) throw userError
      setUser(userData)

      // Fetch savings accounts
      const { data: savingsData, error: savingsError } = await supabase
        .from('savings_accounts')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (savingsError) throw savingsError
      setSavingsAccounts(savingsData || [])

      // Fetch loans
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (loansError) throw loansError
      setLoans(loansData || [])

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(50) // Limit to recent transactions

      if (transactionsError) throw transactionsError
      setTransactions(transactionsData || [])

      // Fetch savings goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (goalsError) throw goalsError
      setSavingsGoals(goalsData || [])

    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createSavingsAccount = async (account: Omit<SavingsAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('savings_accounts')
        .insert([{ ...account, user_id: authUser.id }])
        .select()
        .single()

      if (error) throw error

      setSavingsAccounts(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating savings account:', err)
      throw err
    }
  }

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      // Generate reference if not provided
      const reference = transaction.reference || `${transaction.type.toUpperCase()}-${Date.now()}`

      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: authUser.id, reference }])
        .select()
        .single()

      if (error) throw error

      setTransactions(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating transaction:', err)
      throw err
    }
  }

  const createSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{ ...goal, user_id: authUser.id }])
        .select()
        .single()

      if (error) throw error

      setSavingsGoals(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating savings goal:', err)
      throw err
    }
  }

  const applyForLoan = async (loan: Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('loans')
        .insert([{ ...loan, user_id: authUser.id }])
        .select()
        .single()

      if (error) throw error

      setLoans(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error applying for loan:', err)
      throw err
    }
  }

  return {
    user,
    savingsAccounts,
    loans,
    transactions,
    savingsGoals,
    loading,
    error,
    refetch: fetchUserData,
    createSavingsAccount,
    createTransaction,
    createSavingsGoal,
    applyForLoan
  }
}