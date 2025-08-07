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
  private mockUser: AuthUser | null = null

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
        id: 'mock-user-' + Date.now(),
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        nationalId: userData.nationalId,
        occupation: userData.occupation,
        memberId: `KS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      }
      this.mockUser = mockUser
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
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

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error: error as Error }
    }
  }

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      // Mock authentication for development
      const storedUser = localStorage.getItem('mockUser')
      if (storedUser) {
        this.mockUser = JSON.parse(storedUser)
        return { user: this.mockUser, error: null }
      }
      
      // Create a default mock user for demo
      const mockUser: AuthUser = {
        id: 'demo-user',
        email: 'demo@kawempesacco.ug',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+256 700 123 456',
        nationalId: 'CM12345678901234',
        occupation: 'trader',
        memberId: 'KS-2024-001'
      }
      this.mockUser = mockUser
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
      return { user: mockUser, error: null }
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
      this.mockUser = null
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
      if (this.mockUser) return this.mockUser
      
      const storedUser = localStorage.getItem('mockUser')
      if (storedUser) {
        this.mockUser = JSON.parse(storedUser)
        return this.mockUser
      }
      return null
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
      callback(this.mockUser)
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