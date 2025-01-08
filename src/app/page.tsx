// src/app/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token')

  if (!authToken) {
    redirect('/login')
  } else {
    redirect('/dashboard')
  }
}