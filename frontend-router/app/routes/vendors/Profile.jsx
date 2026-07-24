import { useEffect } from 'react';
import { useLoaderData, Navigate, useFetcher, useRouteLoaderData } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toaster';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  const profileRes = await fetch(`${API_BASE_URL}/api/vendors/profile`, {
    credentials: 'include',
  });
  const profileData = await profileRes.json();

  return {
    vendor: profileData.vendor || {},
  };
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'update-profile') {
    const name = formData.get('name');
    const res = await fetch(`${API_BASE_URL}/api/vendors/profile`, {
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

export default function VendorProfilePage() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const layoutData = useRouteLoaderData('VendorSidebar');

  const vendor = loaderData.vendor || { name: layoutData?.vendor_name || '', email: '' };

  useEffect(() => {
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
          Manage your vendor account settings
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your vendor details</CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="update-profile" />
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={vendor.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={vendor.email}
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
