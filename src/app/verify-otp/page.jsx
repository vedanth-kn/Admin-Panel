// src/components/auth/LoginForm.tsx
'use client'
import { useState } from 'react'
import { Input } from "@heroui/react"
import { Alert } from "@heroui/react"
import '../../styles/login.css';

export default function LoginForm() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  return (
    <div className="login-container">
      <form className="login-form" >
        <h1 className='font-bold'>Login</h1>
        <div className="form-group">
          <label htmlFor="email">OTP:</label>
          <Input className=''
            type="phone"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter 6 digit OTP Number"
            required
            classNames={{
              inputWrapper: "bg-[#ddebf0] text-default-500", // Adds background color to the input field
            }}
          />
        </div>
        
        <button type="submit" className="login-button">
          Verify & Login
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