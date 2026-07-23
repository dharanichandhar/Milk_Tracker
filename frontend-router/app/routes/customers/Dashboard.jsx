import { useLoaderData, Navigate } from 'react-router';
import StatsCard from '@/components/stats-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';
import { API_BASE } from '~/config';

export async function clientLoader() {
  const customerRes = await fetch(`${API_BASE}/api/customers/me`, { credentials: 'include' });
  const customerData = await customerRes.json();

  if (!customerData.logged_in) {
    return { shouldRedirect: true, redirectTo: '/customers/login' };
  }

  const statsRes = await fetch(`${API_BASE}/api/customers/dashboard-stats`, {
    credentials: 'include',
  });
  const statsData = await statsRes.json();

  return {
    shouldRedirect: false,
    customer_name: customerData.name,
    customer_id: customerData.customer_id,
    stats: statsData,
  };
}

clientLoader.hydrate = true;

export default function CustomerDashboard() {
  const loaderData = useLoaderData();

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { stats } = loaderData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {loaderData.customer_name}!
        </h1>
        <p className="text-muted-foreground">
          Here's your milk subscription overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Active Subscriptions"
          value={stats?.active_subscriptions || 0}
          icon={Users}
        />
        <StatsCard
          title="Total Amount"
          value={`₹${stats?.total_amount || 0}`}
          icon={DollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest milk records</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recent_records?.length > 0 ? (
            <div className="space-y-2">
              {stats.recent_records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{record.vendor_name}</span>
                  <span className="text-muted-foreground">
                    {record.quantity}L - ₹{record.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
