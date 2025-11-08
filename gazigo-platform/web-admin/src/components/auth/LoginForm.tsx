'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  onLogin: (phoneNumber: string, otp: string) => void;
  error?: string;
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      if (response.ok) {
        setStep('otp');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'phone') {
      handleSendOTP();
    } else {
      onLogin(phoneNumber, otp);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {step === 'phone' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
            required
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        loading={loading}
        className="w-full bg-primary-blue text-white py-2 rounded-md hover:bg-blue-600"
      >
        {step === 'phone' ? 'Send OTP' : 'Login'}
      </Button>

      {step === 'otp' && (
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="text-sm text-primary-blue hover:underline"
        >
          Back
        </button>
      )}
    </form>
  );
}

