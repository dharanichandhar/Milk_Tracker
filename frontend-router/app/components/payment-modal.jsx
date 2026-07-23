import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import { API_BASE_URL } from "~/config";

const paymentMethods = [
  { id: 'UPI', label: 'UPI', icon: Smartphone, description: 'Pay using UPI apps' },
  { id: 'Card', label: 'Card', icon: CreditCard, description: 'Credit/Debit Card' },
  { id: 'Cash', label: 'Cash', icon: Banknote, description: 'Pay in Cash' },
];

export default function PaymentModal({ vendor, amount, open, onOpenChange, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = React.useState('UPI');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          vendor_id: vendor.vendor_id,
          payment_method: selectedMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPaymentData(data.payment);
        setSuccess(true);
        toast.success('Payment successful!');
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setPaymentData(null);
    setSelectedMethod('UPI');
    onOpenChange(false);
    if (success) {
      onSuccess?.();
    }
  };

  const formatCurrency = (amt) => `₹${amt?.toFixed(2) || '0.00'}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Pay {vendor?.vendor_name} for your milk purchases
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount to Pay</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Vendor: {vendor?.vendor_name}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="grid gap-3"
                >
                  {paymentMethods.map((method) => (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{method.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {selectedMethod === 'UPI' && (
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID (Optional)</Label>
                  <Input
                    id="upi-id"
                    placeholder="yourname@upi"
                    className="bg-background"
                  />
                </div>
              )}

              {selectedMethod === 'Card' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pay {formatCurrency(amount)}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-xl mb-2">Payment Successful!</DialogTitle>
            <DialogDescription className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                Amount Paid: {formatCurrency(paymentData?.amount)}
              </p>
              <p>Vendor: {paymentData?.vendor_name}</p>
              <p>Method: {paymentData?.payment_method}</p>
              <p className="text-sm text-muted-foreground">
                {paymentData?.paid_at
                  ? new Date(paymentData.paid_at).toLocaleString()
                  : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                Bill: {paymentData?.bill_number}
              </p>
            </DialogDescription>
            <Button className="mt-6" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
