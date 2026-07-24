import { useLoaderData, Navigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '~/config';

export async function clientLoader({ params }) {
  const customerRes = await fetch(
    `${API_BASE_URL}/api/vendors/customers/${params.id}`,
    { credentials: 'include' }
  );
  const customerData = await customerRes.json();

  return {
    customer: customerData.customer,
    records: customerData.records || [],
    payments: customerData.payments || [],
  };
}

export default function CustomerDetailPage() {
  const loaderData = useLoaderData();
  const params = useParams();

  const { customer, records, payments } = loaderData;

  const totalQuantity = records.reduce((sum, r) => sum + r.quantity, 0);
  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/vendors/customers">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            {customer?.name}
          </h1>
          <p className="text-muted-foreground">Customer #{params.id}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity}L</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={customer?.is_active ? 'success' : 'secondary'}>
              {customer?.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milk Records</CardTitle>
          <CardDescription>Daily milk purchase history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="hidden md:table-cell">Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.slice(0, 30).map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.quantity}L</TableCell>
                  <TableCell className="hidden md:table-cell">₹{record.price_per_liter}/L</TableCell>
                  <TableCell>₹{record.amount}</TableCell>
                  <TableCell>
                    {record.quantity === 0 ? (
                      <Badge variant="destructive">Skipped</Badge>
                    ) : record.is_override ? (
                      <Badge variant="warning">Modified</Badge>
                    ) : (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Payments from this customer</CardDescription>
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
                  <TableHead className="hidden md:table-cell">Bill #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead>Paid On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="hidden md:table-cell">{payment.bill_number}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.payment_method}</TableCell>
                    <TableCell>{payment.paid_at || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.status === 'success' ? 'success' : 'warning'}
                      >
                        {payment.status}
                      </Badge>
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
