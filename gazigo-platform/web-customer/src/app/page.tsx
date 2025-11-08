'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-blue text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">GAZIGO</h1>
          <p className="mt-2">Your gas, delivered safely. | Votre gaz, livré en toute sécurité.</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to GAZIGO</h2>
          <p className="text-gray-600 mb-6">
            Order your gas cylinders easily and safely. Fast, reliable delivery across Cameroon.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-primary-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              My Account
            </Link>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Quick and reliable gas delivery to your doorstep</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold mb-2">Safe & Secure</h3>
            <p className="text-gray-600 text-sm">Certified partners and traceable deliveries</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold mb-2">Easy Payment</h3>
            <p className="text-gray-600 text-sm">Mobile Money, Orange Money, or Cash on Delivery</p>
          </div>
        </div>
      </main>
    </div>
  );
}

