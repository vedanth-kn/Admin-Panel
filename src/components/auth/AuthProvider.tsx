'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '@/services/api'
import type { UserData } from '@/services/api/types'

type AuthContextType = {
  user: UserData | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user data exists in cookies
    const userData = apiService.getUser()
    if (userData) {
      setUser(userData)
    }
    setIsLoading(false)
  }, [])

  const logout = async () => {
    try {
      await apiService.logout()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  if (isLoading) {
    return null // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}