import { useLoaderData, Navigate, useFetcher, useRevalidator } from 'react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toaster';
import { API_BASE_URL } from '~/config';
import RouteLoading from '@/components/route-loading';

export async function clientAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const vendorId = formData.get('vendorId');

  if (intent === 'update-quantity') {
    const quantity = formData.get('quantity');
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/${vendorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ default_quantity: parseFloat(quantity) }),
    });
    return { success: res.ok, intent: 'update-quantity' };
  }

  if (intent === 'unsubscribe') {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/unsubscribe/${vendorId}`, {
      method: 'POST',
      credentials: 'include',
    });
    return { success: res.ok, intent: 'unsubscribe' };
  }

  return null;
}

export async function clientLoader() {
  try {
    const [authRes, subsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/customers/me`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/api/subscriptions/my-vendors`, { credentials: 'include' }),
    ]);

    const authData = await authRes.json();
    if (!authData.logged_in) {
      return { shouldRedirect: true, redirectTo: '/customers/login' };
    }

    const subsData = await subsRes.json();

    return {
      shouldRedirect: false,
      subscriptions: subsData.vendors || [],
      customer_name: authData.name,
    };
  } catch (err) {
    console.error('Subscriptions loader failed', err);
  }

  return { shouldRedirect: true, redirectTo: '/customers/login' };
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return <RouteLoading />;
}

export default function SubscriptionsPage() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(
          fetcher.data.intent === 'update-quantity'
            ? 'Quantity updated!'
            : 'Unsubscribed successfully!'
        );
        revalidator.revalidate();
      } else {
        toast.error(
          fetcher.data.intent === 'update-quantity'
            ? 'Failed to update quantity'
            : 'Failed to unsubscribe'
        );
      }
    }
  }, [fetcher.data, revalidator]);

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { subscriptions } = loaderData;

  const handleUpdateQuantity = (vendorId, quantity) => {
    const formData = new FormData();
    formData.append('intent', 'update-quantity');
    formData.append('vendorId', vendorId);
    formData.append('quantity', quantity);
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
        <h1 className="text-3xl font-bold tracking-tight">My Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage your milk subscriptions
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              You haven't subscribed to any vendors yet.
            </p>
            <Button className="mt-4" asChild>
              <a href="/customers/vendors">Browse Vendors</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sub.name}</CardTitle>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Daily Quantity (Liters)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      defaultValue={sub.default_quantity || 1}
                      className="flex-1"
                      id={`qty-${sub.id}`}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(`qty-${sub.id}`);
                        handleUpdateQuantity(sub.id, parseFloat(input.value));
                      }}
                      disabled={fetcher.state === 'submitting'}
                    >
                      {fetcher.state === 'submitting' ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleUnsubscribe(sub.id)}
                  disabled={fetcher.state === 'submitting'}
                >
                  {fetcher.state === 'submitting' ? 'Unsubscribing...' : 'Unsubscribe'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
