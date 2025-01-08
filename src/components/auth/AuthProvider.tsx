// src/components/auth/AuthProvider.tsx
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  email: string
  username: string
} | null

type AuthContextType = {
  user: User
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize user from localStorage if available
    const username = localStorage.getItem('username')
    const email = localStorage.getItem('email')
    
    if (username && email) {
      setUser({ username, email })
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Update state and localStorage atomically
      const userData = {
        email: data.user.email,
        username: data.user.username,
      }
      
      setUser(userData)
      localStorage.setItem('username', userData.username)
      localStorage.setItem('email', userData.email)

      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setUser(null)
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      
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
    <AuthContext.Provider value={{ user, login, logout }}>
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