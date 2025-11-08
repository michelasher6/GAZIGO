'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    enabled: !!localStorage.getItem('customerToken'),
  });

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-blue text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">GAZIGO</h1>
            <p className="mt-1">Your gas, delivered safely.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-primary-blue px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <Link
            href="/order/new"
            className="bg-primary-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            New Order
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {orders && orders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tracking #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cylinder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-6 py-4">{order.trackingNumber}</td>
                      <td className="px-6 py-4">{order.cylinderType}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{order.totalAmount} FCFA</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-primary-blue hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No orders yet</p>
                <Link
                  href="/order/new"
                  className="text-primary-blue hover:underline"
                >
                  Place your first order
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

