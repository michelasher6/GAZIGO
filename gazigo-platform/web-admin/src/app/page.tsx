'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication and redirect if needed
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return <Dashboard />;
}

