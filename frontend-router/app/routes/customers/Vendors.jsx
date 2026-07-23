import { useLoaderData, useFetcher, Navigate, useRevalidator } from 'react-router';
import { useEffect } from 'react';
import VendorCard from '@/components/vendor-card';
import { toast } from '@/components/ui/toaster';
import { API_BASE } from '~/config';

export async function clientAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const vendorId = formData.get('vendorId');

  if (intent === 'subscribe') {
    const res = await fetch(`${API_BASE}/api/subscriptions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ vendor_id: parseInt(vendorId), quantity: 1 }),
    });
    const data = res.ok ? {} : await res.json();
    return { success: res.ok, intent: 'subscribe', error: data.detail };
  }

  if (intent === 'unsubscribe') {
    const res = await fetch(`${API_BASE}/api/subscriptions/unsubscribe/${vendorId}`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = res.ok ? {} : await res.json();
    return { success: res.ok, intent: 'unsubscribe', error: data.detail };
  }

  return null;
}

export async function clientLoader() {
  const [authRes, vendorsRes, subsRes] = await Promise.all([
    fetch(`${API_BASE}/api/customers/me`, { credentials: 'include' }),
    fetch(`${API_BASE}/api/vendors/all`, { credentials: 'include' }),
    fetch(`${API_BASE}/api/subscriptions/my-vendors`, { credentials: 'include' }),
  ]);

  const authData = await authRes.json();
  if (!authData.logged_in) {
    return { shouldRedirect: true, redirectTo: '/customers/login' };
  }

  const vendorsData = await vendorsRes.json();
  const subsData = await subsRes.json();

  const subscribedVendorIds = new Set(
    subsData.vendors?.map((v) => v.id) || []
  );

  return {
    shouldRedirect: false,
    vendors: vendorsData,
    subscribedVendorIds,
    customer_name: authData.name,
  };
}

clientLoader.hydrate = true;

export default function VendorsPage() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(
          fetcher.data.intent === 'subscribe'
            ? 'Subscribed successfully!'
            : 'Unsubscribed successfully!'
        );
        revalidator.revalidate();
      } else {
        toast.error(fetcher.data.error || 'Action failed');
      }
    }
  }, [fetcher.data, revalidator]);

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { vendors, subscribedVendorIds } = loaderData;

  const handleSubscribe = (vendorId) => {
    const formData = new FormData();
    formData.append('intent', 'subscribe');
    formData.append('vendorId', vendorId);
    fetcher.submit(formData, { method: 'post' });
  };

  const handleUnsubscribe = (vendorId) => {
    if (!window.confirm('Are you sure you want to unsubscribe?')) return;
    const formData = new FormData();
    formData.append('intent', 'unsubscribe');
    formData.append('vendorId', vendorId);
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Milk Vendors</h1>
        <p className="text-muted-foreground">
          Browse and subscribe to milk vendors
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            isSubscribed={subscribedVendorIds.has(vendor.id)}
            onSubscribe={() => handleSubscribe(vendor.id)}
            onUnsubscribe={() => handleUnsubscribe(vendor.id)}
            loading={fetcher.state === 'submitting'}
          />
        ))}
      </div>

      {vendors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No vendors available</p>
        </div>
      )}
    </div>
  );
}
