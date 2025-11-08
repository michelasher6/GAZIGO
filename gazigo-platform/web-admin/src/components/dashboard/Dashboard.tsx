'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import StatsCards from './StatsCards';
import RecentOrders from './RecentOrders';
import OrdersChart from './OrdersChart';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Dashboard
            </h1>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <>
                <StatsCards stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <OrdersChart />
                  <RecentOrders />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

