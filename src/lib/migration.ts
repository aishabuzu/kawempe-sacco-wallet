import { supabase } from './supabase'
import { isSupabaseConfigured } from './supabase'
import type { User, SavingsAccount, Loan, Transaction, SavingsGoal } from './supabase'

// Mock data interfaces (matching the current app structure)
interface MockUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nationalId: string
  occupation: string
}

interface MockSavingsAccount {
  id: number
  name: string
  balance: number
  interestRate: number
  type: 'regular' | 'emergency' | 'business'
  monthlyContribution: number
  lastContribution: string
}

interface MockLoan {
  id: number
  type: string
  amount: number
  outstanding: number
  interestRate: number
  monthlyPayment: number
  nextPayment: string
  status: 'active' | 'completed' | 'pending'
  disbursed: string
  maturity: string
}

interface MockTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'payment' | 'fee'
  category: string
  amount: number
  description: string
  date: string
  time: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  balance: number
}

interface MockSavingsGoal {
  name: string
  current: number
  target: number
  color: string
}

export class DataMigration {
  private userId: string | null = null

  constructor(userId?: string) {
    this.userId = userId || null
  }

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot fetch user data')
      return null
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  async migrateUser(mockUser: MockUser): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping user migration')
      return false
    }
    
    try {
      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: mockUser.email,
        password: 'TempPassword123!', // User should change this
        options: {
          data: {
            first_name: mockUser.firstName,
            last_name: mockUser.lastName
          }
        }
      })

      if (authError) {
        console.error('Error creating auth user:', authError)
        return false
      }

      if (!authData.user) {
        console.error('No user returned from auth signup')
        return false
      }

      // Update user profile with additional data
      const { error: profileError } = await supabase
        .from('users')
        .update({
          phone: mockUser.phone,
          national_id: mockUser.nationalId,
          occupation: mockUser.occupation
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Error updating user profile:', profileError)
        return false
      }

      this.userId = authData.user.id
      return true
    } catch (error) {
      console.error('Error migrating user:', error)
      return false
    }
  }

  async migrateSavingsAccounts(mockAccounts: MockSavingsAccount[]): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping savings accounts migration')
      return false
    }
    
    if (!this.userId) {
      console.error('No user ID available for migration')
      return false
    }

    try {
      const accountsToInsert = mockAccounts.map(account => ({
        user_id: this.userId,
        name: account.name,
        balance: account.balance,
        interest_rate: account.interestRate,
        type: account.type,
        monthly_contribution: account.monthlyContribution
      }))

      const { error } = await supabase
        .from('savings_accounts')
        .insert(accountsToInsert)

      if (error) {
        console.error('Error migrating savings accounts:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error migrating savings accounts:', error)
      return false
    }
  }

  async migrateLoans(mockLoans: MockLoan[]): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping loans migration')
      return false
    }
    
    if (!this.userId) {
      console.error('No user ID available for migration')
      return false
    }

    try {
      const loansToInsert = mockLoans.map(loan => ({
        user_id: this.userId,
        type: loan.type,
        amount: loan.amount,
        outstanding: loan.outstanding,
        interest_rate: loan.interestRate,
        monthly_payment: loan.monthlyPayment,
        status: loan.status,
        disbursed_date: loan.disbursed,
        maturity_date: loan.maturity
      }))

      const { error } = await supabase
        .from('loans')
        .insert(loansToInsert)

      if (error) {
        console.error('Error migrating loans:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error migrating loans:', error)
      return false
    }
  }

  async migrateTransactions(mockTransactions: MockTransaction[]): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping transactions migration')
      return false
    }
    
    if (!this.userId) {
      console.error('No user ID available for migration')
      return false
    }

    try {
      const transactionsToInsert = mockTransactions.map(transaction => ({
        user_id: this.userId,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        reference: transaction.reference,
        status: transaction.status,
        balance_after: transaction.balance,
        created_at: new Date(`${transaction.date}T${transaction.time}`).toISOString()
      }))

      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)

      if (error) {
        console.error('Error migrating transactions:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error migrating transactions:', error)
      return false
    }
  }

  async migrateSavingsGoals(mockGoals: MockSavingsGoal[]): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping savings goals migration')
      return false
    }
    
    if (!this.userId) {
      console.error('No user ID available for migration')
      return false
    }

    try {
      const goalsToInsert = mockGoals.map(goal => ({
        user_id: this.userId,
        name: goal.name,
        target_amount: goal.target,
        current_amount: goal.current,
        target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        category: this.mapGoalCategory(goal.name)
      }))

      const { error } = await supabase
        .from('savings_goals')
        .insert(goalsToInsert)

      if (error) {
        console.error('Error migrating savings goals:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error migrating savings goals:', error)
      return false
    }
  }

  private mapGoalCategory(goalName: string): string {
    const name = goalName.toLowerCase()
    if (name.includes('emergency')) return 'emergency'
    if (name.includes('business')) return 'business'
    if (name.includes('home') || name.includes('house')) return 'housing'
    if (name.includes('education')) return 'education'
    return 'other'
  }

  async migrateAllData(data: {
    user: MockUser
    savingsAccounts: MockSavingsAccount[]
    loans: MockLoan[]
    transactions: MockTransaction[]
    savingsGoals: MockSavingsGoal[]
  }): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = []

    // Migrate user first
    const userSuccess = await this.migrateUser(data.user)
    if (!userSuccess) {
      errors.push('Failed to migrate user data')
      return { success: false, errors }
    }

    // Migrate savings accounts
    const savingsSuccess = await this.migrateSavingsAccounts(data.savingsAccounts)
    if (!savingsSuccess) {
      errors.push('Failed to migrate savings accounts')
    }

    // Migrate loans
    const loansSuccess = await this.migrateLoans(data.loans)
    if (!loansSuccess) {
      errors.push('Failed to migrate loans')
    }

    // Migrate transactions
    const transactionsSuccess = await this.migrateTransactions(data.transactions)
    if (!transactionsSuccess) {
      errors.push('Failed to migrate transactions')
    }

    // Migrate savings goals
    const goalsSuccess = await this.migrateSavingsGoals(data.savingsGoals)
    if (!goalsSuccess) {
      errors.push('Failed to migrate savings goals')
    }

    return {
      success: errors.length === 0,
      errors
    }
  }

  // Helper method to export current mock data for migration
  static getMockData() {
    return {
      user: {
        id: "user-001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+256 700 123 456",
        nationalId: "CM12345678901234",
        occupation: "trader"
      },
      savingsAccounts: [
        {
          id: 1,
          name: "Regular Savings",
          balance: 1200000,
          interestRate: 7,
          type: "regular" as const,
          monthlyContribution: 50000,
          lastContribution: "2024-01-25"
        },
        {
          id: 2,
          name: "Emergency Fund",
          balance: 600000,
          interestRate: 5,
          type: "emergency" as const,
          monthlyContribution: 25000,
          lastContribution: "2024-01-20"
        },
        {
          id: 3,
          name: "Business Development",
          balance: 800000,
          interestRate: 8,
          type: "business" as const,
          monthlyContribution: 75000,
          lastContribution: "2024-01-28"
        }
      ],
      loans: [
        {
          id: 1,
          type: "Emergency Loan",
          amount: 500000,
          outstanding: 350000,
          interestRate: 12,
          monthlyPayment: 45000,
          nextPayment: "2024-02-05",
          status: "active" as const,
          disbursed: "2023-08-15",
          maturity: "2024-08-15"
        },
        {
          id: 2,
          type: "Business Development",
          amount: 1000000,
          outstanding: 750000,
          interestRate: 15,
          monthlyPayment: 85000,
          nextPayment: "2024-02-08",
          status: "active" as const,
          disbursed: "2023-10-01",
          maturity: "2024-10-01"
        }
      ],
      transactions: [
        {
          id: "TXN001",
          type: "deposit" as const,
          category: "savings",
          amount: 75000,
          description: "Monthly Savings Contribution - Regular Account",
          date: "2024-01-28",
          time: "14:30",
          status: "completed" as const,
          reference: "SAV-20240128-001",
          balance: 1875000
        },
        {
          id: "TXN002",
          type: "withdrawal" as const,
          category: "loan",
          amount: -200000,
          description: "Emergency Loan Disbursement",
          date: "2024-01-25",
          time: "10:15",
          status: "completed" as const,
          reference: "LOAN-20240125-002",
          balance: 1800000
        }
      ],
      savingsGoals: [
        { name: "Emergency Fund", current: 600000, target: 1000000, color: "#22c55e" },
        { name: "Business Capital", current: 800000, target: 1500000, color: "#3b82f6" },
        { name: "Home Purchase", current: 400000, target: 2000000, color: "#f59e0b" }
      ]
    }
  }
}