'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Link from 'next/link';

export default function RecentOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await api.get('/orders?limit=10');
      return response.data;
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      dispatched: 'bg-indigo-100 text-indigo-800',
      in_transit: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <Link
          href="/orders"
          className="text-primary-blue hover:underline text-sm"
        >
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">
                Order ID
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">
                Customer
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2 text-sm">
                  {order.trackingNumber || order.id.slice(0, 8)}
                </td>
                <td className="py-2 px-2 text-sm">{order.customerPhone}</td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-sm text-right">
                  {order.totalAmount.toLocaleString()} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

