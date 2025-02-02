'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { API_CONFIG } from '../../services/api/config'

export default function Dashboard() {
  const [name, setname] = useState('');
  console.log(API_CONFIG.getHeaders())

  return (
    <Layout>
    <div className='container'>
      <h2>Dashboard</h2>
    </div>
    </Layout>
  );
}
