'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function Dashboard() {
  const [name, setname] = useState('');

  return (
    <Layout>
    <div className='container'>
      <h2>Dashboard</h2>
    </div>
    </Layout>
  );
}
