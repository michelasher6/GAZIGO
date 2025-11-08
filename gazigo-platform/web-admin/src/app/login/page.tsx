'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (phoneNumber: string, otp: string) => {
    try {
      // TODO: Implement admin authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp, role: 'admin' }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.tokens.accessToken);
        router.push('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-primary-blue">
            GAZIGO Admin
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        <LoginForm onLogin={handleLogin} error={error} />
      </div>
    </div>
  );
}

