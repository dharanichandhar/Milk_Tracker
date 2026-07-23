import { useLoaderData, Navigate } from 'react-router';
import StatsCard from '@/components/stats-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, CreditCard, AlertCircle, Package } from 'lucide-react';
import { API_BASE } from '~/config';

export async function clientLoader() {
  const vendorRes = await fetch(`${API_BASE}/api/vendors/me`, { credentials: 'include' });
  const vendorData = await vendorRes.json();

  if (!vendorData.logged_in) {
    return { shouldRedirect: true, redirectTo: '/vendors/login' };
  }

  const [analyticsRes, paymentAnalyticsRes] = await Promise.all([
    fetch(`${API_BASE}/api/vendors/analytics`, { credentials: 'include' }),
    fetch(`${API_BASE}/api/vendors/payment-analytics`, { credentials: 'include' }),
  ]);

  const analyticsData = await analyticsRes.json();
  const paymentAnalyticsData = await paymentAnalyticsRes.json();

  return {
    shouldRedirect: false,
    vendor_id: vendorData.vendor_id,
    vendor_name: vendorData.name,
    analytics: analyticsData,
    paymentAnalytics: paymentAnalyticsData,
  };
}

clientLoader.hydrate = true;

export default function VendorDashboard() {
  const loaderData = useLoaderData();

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { analytics, vendor_name, paymentAnalytics } = loaderData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {vendor_name}!
        </h1>
        <p className="text-muted-foreground">
          Here's your vendor dashboard overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value={analytics?.total_customers || 0}
          icon={Users}
        />
        <StatsCard
          title="Total Payments"
          value={`₹${paymentAnalytics?.total_revenue || 0}`}
          icon={CreditCard}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${paymentAnalytics?.monthly_revenue || 0}`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Quantity Sold"
          value={`${analytics?.total_quantity || 0}L`}
          icon={Package}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Pending Customer Payments
          </CardTitle>
          <CardDescription>Customers with unpaid amounts</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentAnalytics?.pending_customer_payments?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending payments
            </p>
          ) : (
            <div className="space-y-3">
              {paymentAnalytics?.pending_customer_payments?.slice(0, 5).map((customer) => (
                <div
                  key={customer.customer_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{customer.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Customer #{customer.customer_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-500">
                      ₹{customer.pending_amount.toFixed(2)}
                    </p>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
