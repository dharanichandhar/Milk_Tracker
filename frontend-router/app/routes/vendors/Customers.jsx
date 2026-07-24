import { useLoaderData, Navigate } from 'react-router';
import CustomerCard from '@/components/customer-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  try {
    const vendorRes = await fetch(`${API_BASE_URL}/api/vendors/me`, { credentials: 'include' });
    const vendorData = await vendorRes.json();

    if (!vendorData.logged_in) {
      return { shouldRedirect: true, redirectTo: '/vendors/login' };
    }

    const customersRes = await fetch(`${API_BASE_URL}/api/vendors/customers`, {
      credentials: 'include',
    });
    const customersData = await customersRes.json();

    return {
      shouldRedirect: false,
      customers: customersData.customers || [],
      vendor_name: vendorData.name,
    };
  } catch (err) {
    console.error('Customers loader failed', err);
  }

  return { shouldRedirect: true, redirectTo: '/vendors/login' };
}

clientLoader.hydrate = true;

export default function CustomersPage() {
  const loaderData = useLoaderData();
  const [search, setSearch] = useState('');

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { customers } = loaderData;

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          View and manage your customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Customers</CardTitle>
          <CardDescription>
            Find customers by name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => (window.location.href = `/vendors/customers/${customer.id}`)}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No customers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
