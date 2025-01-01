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
    <div className='p-8 ml-[-2%] w-[102%] h-32 bg-white rounded-[16px]'>
      <h2>Hello!! {username || 'Guest'}</h2>
      <p>This is the dashboard page after login.</p>
    </div>
    </Layout>
  );
}
