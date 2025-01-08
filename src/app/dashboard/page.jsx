'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function Dashboard() {
  const [username, setUsername] = useState('');

  // Fetch username from localStorage or a state management library
  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Assuming you store it during login
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Layout>
    <div className='p-6 w-[100.8%] h-[1000px] mt-[-22px] bg-white border-4 border-[#cadce3] border-gray-300 rounded-[16px]'>
      <h2>Hello!! {username || 'Guest'}</h2>
      <p>This is the dashboard page after login.</p>
    </div>
    </Layout>
  );
}
