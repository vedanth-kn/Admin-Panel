// src/app/login/page.tsx
'use client'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuth } from '@/components/auth/AuthProvider'

export default function LoginPage() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  )
}