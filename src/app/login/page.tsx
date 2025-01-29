'use client'
import { useState } from 'react'
import { Input } from "@heroui/react"
import { Alert } from "@heroui/react"
import { apiService } from '@/services/api'
import '../../styles/login.css'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const router = useRouter() 

  const startResendTimer = () => {
    setTimer(30)
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }
  
    try {
      const response = await apiService.sendOTP(phone)
      
      if (response.success) {
        setIsOtpSent(true)
        setSuccess('OTP sent successfully')
        setError('')
        startResendTimer()
      } else {
        setError('Failed to send OTP')
      }
    } catch (err) {
      console.error('Send OTP Error:', err)
      setError('Failed to send OTP. Please try again.')
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
  
    try {
      const response = await apiService.verifyOTP({
        phone_number: phone,
        otp: otp
      })
  
      if (response.success) {
        setSuccess('Login successful')
        setError('')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(response.errorMessage || 'Invalid OTP')
      }
    } catch (err) {
      console.error('Verify OTP Error:', err)
      setError('Invalid OTP. Please try again.')
    }
  }

  const handleResendOtp = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (timer > 0) return

    try {
      const formData = new FormData()
      formData.append('phone_number', phone)
      
      const response = await apiService.sendOTP(phone)
      
      if (response.success) {
        setSuccess('OTP resent successfully')
        setError('')
        startResendTimer()
      } else {
        setError(response.errorMessage || 'Failed to resend OTP')
      }
    } catch (err) {
      console.error('Resend OTP Error:', err)
      setError('Failed to resend OTP. Please try again.')
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleVerifyOtp}>
        <h1 className="font-bold">Login</h1>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <div className="flex gap-2">
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your Phone Number"
              required
              classNames={{
                inputWrapper: "bg-[#ddebf0] text-default-500",
              }}
            />
            {!isOtpSent && (
              <button
                onClick={handleSendOtp}
                className="send-otp-button"
                type="button"
              >
                Send OTP
              </button>
            )}
          </div>
        </div>
        
        {isOtpSent && (
          <div className="form-group">
            <label htmlFor="otp">OTP:</label>
            <Input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6 digit OTP Number"
              required
              maxLength={6}
              classNames={{
                inputWrapper: "bg-[#ddebf0] text-default-500",
              }}
            />
            <div className="resend-container">
              {timer > 0 ? (
                <span className="resend-timer">Resend OTP in {timer}s</span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="resend-link"
                  type="button"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
        
        {isOtpSent && (
          <button type="submit" className="login-button">
            Verify & Login
          </button>
        )}

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
  )
}