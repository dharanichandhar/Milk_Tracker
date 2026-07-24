import { useLoaderData, Navigate, useRouteLoaderData } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt } from 'lucide-react';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  const historyRes = await fetch(`${API_BASE_URL}/api/vendors/payment-history`, {
    credentials: 'include',
  });
  const historyData = await historyRes.json();

  return {
    payments: historyData.payments || [],
  };
}

export default function VendorPaymentHistory() {
  const loaderData = useLoaderData();
  const layoutData = useRouteLoaderData('VendorSidebar');
  const { payments } = loaderData;
  const vendor_name = layoutData?.vendor_name || '';

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">
          All payments received by {vendor_name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Amount Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            All Payments
          </CardTitle>
          <CardDescription>Complete payment transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payment history
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead className="hidden md:table-cell">Bill #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.paid_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.customer_name}
                    </TableCell>
                    <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{payment.payment_method}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {payment.bill_number}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
