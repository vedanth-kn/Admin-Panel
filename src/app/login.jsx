'use client'; // To enable client-side React hooks

// src/app/login.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importing useRouter for navigation
import { Alert, Input } from '@nextui-org/react'; // Import Input and Alert from NextUI
import { EyeSlashFilledIcon, EyeFilledIcon } from '../asset/EyeSlashFilledIcon'; // Import the icons

import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to handle error message
  const [success, setSuccess] = useState(''); // State to handle success message
  const [username, setUsername] = useState(''); // State to store the username
  const [isVisible, setIsVisible] = useState(false); // State for password visibility toggle
  const router = useRouter(); // Initialize router for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset messages before making the API request
    setError('');
    setSuccess('');

    // Here you should make the API request to your backend (for example, using fetch or axios)
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Check if login is successful (e.g., token is returned)
    if (res.ok && data.token) {
      console.log('Login successful:', data);

      // Store the username and token (optional: in localStorage or a state management library)
      setUsername(data.username);
      setEmail(data.email)

      // Store username in localStorage
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);
      console.log('Email to be stored:', data.email);

      // Set success message
      setSuccess(`Welcome ${data.username}!`);

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      console.log('Login failed:', data);

      // Set error message for failed login
      setError('Invalid email or password!');
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible); // Toggle password visibility

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
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
};

export default Login;
