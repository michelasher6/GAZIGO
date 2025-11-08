'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export default function VendorDashboard() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/vendor');
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary-blue">GAZIGO Vendor</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
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
                {orders?.map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-6 py-4">{order.trackingNumber}</td>
                    <td className="px-6 py-4">{order.cylinderType}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.totalAmount} FCFA</td>
                    <td className="px-6 py-4">
                      <button className="text-primary-blue hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

