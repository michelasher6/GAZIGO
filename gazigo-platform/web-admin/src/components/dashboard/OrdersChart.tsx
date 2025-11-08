'use client';

import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/services/api';

export default function OrdersChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['orders-chart'],
    queryFn: async () => {
      const response = await api.get('/admin/orders/chart');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Orders Trend</h2>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Orders Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#1E90FF"
            strokeWidth={2}
            name="Orders"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#FF8C00"
            strokeWidth={2}
            name="Revenue (FCFA)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

