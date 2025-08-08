import { supabase, isSupabaseConfigured } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  nationalId?: string
  occupation?: string
  memberId?: string
}

class AuthService {
  private mockUsers: Map<string, { password: string; user: AuthUser }> = new Map()
  private currentMockUser: AuthUser | null = null

  constructor() {
    // Initialize with demo user
    this.mockUsers.set('demo@kawempesacco.ug', {
      password: 'password',
      user: {
        id: 'demo-user',
        email: 'demo@kawempesacco.ug',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+256 700 123 456',
        nationalId: 'CM12345678901234',
        occupation: 'trader',
        memberId: 'KS-2024-001'
      }
    })

    // Load stored mock user
    const storedUser = localStorage.getItem('mockUser')
    if (storedUser) {
      try {
        this.currentMockUser = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('mockUser')
      }
    }
  }

  async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    phone: string
    nationalId: string
    occupation: string
  }) {
    if (!isSupabaseConfigured()) {
      // Mock authentication for development
      const mockUser: AuthUser = {
        id: 'user-' + Date.now(),
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        nationalId: userData.nationalId,
        occupation: userData.occupation,
        memberId: `KS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      }

      // Store in mock database
      this.mockUsers.set(email, { password, user: mockUser })
      this.currentMockUser = mockUser
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
      localStorage.setItem('mockUsers', JSON.stringify(Array.from(this.mockUsers.entries())))

      return { user: mockUser, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            national_id: userData.nationalId,
            occupation: userData.occupation
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            national_id: userData.nationalId,
            occupation: userData.occupation,
            member_id: `KS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          }])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error: error as Error }
    }
  }

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      // Load stored mock users
      const storedUsers = localStorage.getItem('mockUsers')
      if (storedUsers) {
        try {
          const users = new Map(JSON.parse(storedUsers))
          this.mockUsers = users
        } catch (error) {
          console.error('Error loading stored users:', error)
        }
      }

      // Check mock users
      const mockUserData = this.mockUsers.get(email)
      if (mockUserData && mockUserData.password === password) {
        this.currentMockUser = mockUserData.user
        localStorage.setItem('mockUser', JSON.stringify(mockUserData.user))
        return { user: mockUserData.user, error: null }
      }

      return { user: null, error: new Error('Invalid email or password') }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { user: null, error: error as Error }
    }
  }

  async signOut() {
    if (!isSupabaseConfigured()) {
      this.currentMockUser = null
      localStorage.removeItem('mockUser')
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as Error }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) {
      return this.currentMockUser
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Get additional user data from profiles table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        return {
          id: user.id,
          email: user.email || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone,
          nationalId: profile.national_id,
          occupation: profile.occupation,
          memberId: profile.member_id
        }
      }

      return {
        id: user.id,
        email: user.email || '',
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone,
        nationalId: user.user_metadata?.national_id,
        occupation: user.user_metadata?.occupation,
        memberId: user.user_metadata?.member_id
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!isSupabaseConfigured()) {
      // For mock auth, call callback immediately with current user
      callback(this.currentMockUser)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = await this.getCurrentUser()
        callback(authUser)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()