import { useLoaderData, Navigate, useRevalidator } from 'react-router';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import PaymentModal from '@/components/payment-modal';
import { toast } from '@/components/ui/toaster';
import { CreditCard, History, ShoppingBag } from 'lucide-react';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  const [authRes, payablesRes, historyRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/customers/me`, { credentials: 'include' }),
    fetch(`${API_BASE_URL}/api/customers/payable-amounts`, { credentials: 'include' }),
    fetch(`${API_BASE_URL}/api/customers/payment-history`, { credentials: 'include' }),
  ]);

  const authData = await authRes.json();
  if (!authData.logged_in) {
    return { shouldRedirect: true, redirectTo: '/customers/login' };
  }

  const payablesData = await payablesRes.json();
  const historyData = await historyRes.json();

  return {
    shouldRedirect: false,
    payables: payablesData.payables || [],
    grandTotal: payablesData.grand_total || 0,
    paymentHistory: historyData.payments || [],
    customer_name: authData.name,
  };
}

clientLoader.hydrate = true;

export default function PaymentsPage() {
  const loaderData = useLoaderData();
  const revalidator = useRevalidator();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  const { payables, grandTotal, paymentHistory } = loaderData;

  const handlePayNow = (vendor) => {
    setSelectedVendor(vendor);
    setModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment completed successfully!');
    revalidator.revalidate();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No previous payment';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage your vendor payments
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Pending Payments
              </CardTitle>
              <CardDescription>
                Vendor-wise payable amounts
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Grand Total</p>
              <p className="text-2xl font-bold text-primary">
                ₹{grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payables.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending payments</p>
              <p className="text-sm text-muted-foreground mt-1">
                All your payments are up to date
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payables.map((vendor) => (
                <div
                  key={vendor.vendor_id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{vendor.vendor_name}</h3>
                      <Badge variant="secondary">
                        {vendor.record_count} records
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vendor.total_quantity.toFixed(1)}L pending
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last payment: {formatDate(vendor.last_payment_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">₹{vendor.total_amount.toFixed(2)}</p>
                    <Button
                      className="mt-2"
                      onClick={() => handlePayNow(vendor)}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            Your completed payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payment history</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your completed payments will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Bill #</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.paid_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.vendor_name}
                    </TableCell>
                    <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.payment_method}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.bill_number}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Success</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaymentModal
        vendor={selectedVendor}
        amount={selectedVendor?.total_amount || 0}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
