// src/components/auth/LoginForm.tsx
'use client'
import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Input } from '@nextui-org/react'
import { EyeSlashFilledIcon, EyeFilledIcon } from '@/components/icons/Eye'
import { Alert } from '@nextui-org/react'
import '../../styles/login.css';

export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await login({ email, password })
      setSuccess('Login successful!')
    } catch (err) {
      setError('Invalid email or password!')
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className='font-bold'>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <Input className=''
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            classNames={{
              inputWrapper: "bg-[#ddebf0] text-default-500", // Adds background color to the input field
            }}
          />
        </div>
        <div className="form-group">
  <label htmlFor="password">Password:</label>
  <Input
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter your password"
    required
    type={isVisible ? 'text' : 'password'}
    classNames={{
      inputWrapper: "bg-[#ddebf0] text-default-500", // Adds background color to the input field
    }}
    endContent={
      <button
        aria-label="toggle password visibility"
        className="focus:outline-none"
        type="button"
        onClick={toggleVisibility}
      >
        {isVisible ? (
          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        ) : (
          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        )}
      </button>
    }
  />
</div>

        <button type="submit" className="login-button">
          Login
        </button>
        {/* Display the alert messages below the form */}
        <div className="alert-container">
          {error && (
            <Alert color="danger" title="Error">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="success" title="Success">
              {success}
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}