'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { API_CONFIG } from '../../services/api/config'
import { ToastContainer, toast } from 'react-toastify';
const notify = () => toast("Wow so easy!");

export default function Dashboard() {
  const [name, setname] = useState('');
  console.log(API_CONFIG.getHeaders())

  return (
    <Layout>
    <div className='container'>
      <h2>Dashboard</h2>
      <button onClick={notify}>Notify!</button>
        <ToastContainer />
    </div>
    </Layout>
  );
}
