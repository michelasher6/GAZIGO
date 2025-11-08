'use client';

interface StatsCardsProps {
  stats?: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    activeVendors: number;
    activeCustomers: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      color: 'bg-primary-blue',
      icon: '📦',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      color: 'bg-warning',
      icon: '⏳',
    },
    {
      title: 'Completed Orders',
      value: stats?.completedOrders || 0,
      color: 'bg-success',
      icon: '✅',
    },
    {
      title: 'Total Revenue',
      value: `FCFA ${(stats?.totalRevenue || 0).toLocaleString()}`,
      color: 'bg-primary-orange',
      icon: '💰',
    },
    {
      title: 'Active Vendors',
      value: stats?.activeVendors || 0,
      color: 'bg-info',
      icon: '🏪',
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers || 0,
      color: 'bg-purple-500',
      icon: '👥',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg shadow-md p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

