import { useEffect } from 'react';
import { useLoaderData, Navigate, useFetcher } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toaster';
import { DollarSign } from 'lucide-react';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  const pricingRes = await fetch(`${API_BASE_URL}/api/vendors/pricing`, {
    credentials: 'include',
  });
  const pricingData = await pricingRes.json();

  return {
    currentPrice: pricingData.current_price || 60,
    priceHistory: pricingData.history || [],
  };
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const price = formData.get('price');

  const res = await fetch(`${API_BASE_URL}/api/vendors/pricing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ price_per_liter: parseFloat(price) }),
  });

  if (res.ok) {
    return { success: true, message: 'Price updated successfully!' };
  }
  return { success: false, message: 'Failed to update price' };
}

export default function PricingPage() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const { currentPrice, priceHistory } = loaderData;

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
        <h1 className="text-3xl font-bold tracking-tight">Milk Pricing</h1>
        <p className="text-muted-foreground">
          Manage your milk price per liter
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Price
            </CardTitle>
            <CardDescription>
              Update your milk price for future orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per Liter (₹)</Label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="0.5"
                    defaultValue={currentPrice}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={fetcher.state === 'submitting'}>
                    {fetcher.state === 'submitting' ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Price changes will only affect future orders. Past records
                will remain unchanged.
              </p>
            </fetcher.Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
            <CardDescription>
              Previous price changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {priceHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No price history
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Price</TableHead>
                    <TableHead>Effective From</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        ₹{item.price_per_liter}/L
                      </TableCell>
                      <TableCell>{item.effective_from}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
