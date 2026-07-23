import * as React from 'react';
import { useLoaderData, Navigate, useFetcher } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toaster';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  const res = await fetch(`${API_BASE_URL}/api/customers/me`, { credentials: 'include' });
  const data = await res.json();

  if (!data.logged_in) {
    return { shouldRedirect: true, redirectTo: '/customers/login' };
  }

  return {
    shouldRedirect: false,
    customer: data,
  };
}

clientLoader.hydrate = true;

export async function clientAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'update-profile') {
    const name = formData.get('name');
    const res = await fetch(`${API_BASE_URL}/api/customers/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      return { success: true, message: 'Profile updated!' };
    }
    return { success: false, message: 'Failed to update profile' };
  }

  return null;
}

export default function ProfilePage() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { customer } = loaderData;

  React.useEffect(() => {
    if (fetcher.data?.message) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message);
      } else {
        toast.error(fetcher.data.message);
      }
    }
  }, [fetcher.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="update-profile" />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={customer.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={customer.email}
                disabled
              />
            </div>
            <Button type="submit" disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' ? 'Saving...' : 'Save Changes'}
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
