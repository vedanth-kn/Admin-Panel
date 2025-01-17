'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function Dashboard() {
  const [name, setname] = useState('');

  // Fetch name from localStorage or a state management library
  useEffect(() => {
    const storedname = localStorage.getItem('name'); // Assuming you store it during login
    if (storedname) {
      setname(storedname);
    }
  }, []);

  return (
    <Layout>
    <div className='container'>
      <h2>Hello!! {name || 'Guest'}</h2>
      <p>This is the dashboard page after login.</p>
    </div>
    </Layout>
  );
}
