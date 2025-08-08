import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, type AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>
  signUp: (email: string, password: string, userData: {
    firstName: string
    lastName: string
    phone: string
    nationalId: string
    occupation: string
  }) => Promise<{ user: AuthUser | null; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    authService.getCurrentUser().then(user => {
      setUser(user)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription?.data?.subscription?.unsubscribe?.()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await authService.signIn(email, password)
    if (result.user) {
      setUser(result.user)
    }
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, userData: {
    firstName: string
    lastName: string
    phone: string
    nationalId: string
    occupation: string
  }) => {
    setLoading(true)
    const result = await authService.signUp(email, password, userData)
    if (result.user) {
      setUser(result.user)
    }
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    const result = await authService.signOut()
    setUser(null)
    setLoading(false)
    return result
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}