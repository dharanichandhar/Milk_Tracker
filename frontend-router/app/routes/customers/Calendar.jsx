import { useLoaderData, Navigate } from 'react-router';
import { useState } from 'react';
import MilkCalendar from '@/components/milk-calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toaster';
import { format, parseISO } from 'date-fns';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  const subsRes = await fetch(`${API_BASE_URL}/api/subscriptions/my-vendors`, {
    credentials: 'include',
  });
  const subsData = await subsRes.json();

  return {
    subscriptions: subsData.vendors || [],
  };
}

export default function CalendarPage() {
  const loaderData = useLoaderData();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editQuantity, setEditQuantity] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(60);
  const [totalAmount, setTotalAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  const { subscriptions } = loaderData;

  const fetchVendorPrice = async (vendorId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}/price`);
      if (res.ok) {
        const data = await res.json();
        setCurrentPrice(data.current_price || 60);
      }
    } catch (err) {
      console.error('Failed to fetch price:', err);
    }
  };

  const fetchTotalAmount = async (vendorId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/payable-amounts`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        const vendorPayable = data.payables.find((p) => p.vendor_id === vendorId);
        setTotalAmount(vendorPayable?.total_amount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch total:', err);
    }
  };

  const handleVendorSelect = async (vendorId) => {
    const vendor = subscriptions.find((s) => s.id === parseInt(vendorId));
    setSelectedVendor(vendor);

    const [recordsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/milk-records/?vendor_id=${vendorId}`, { credentials: 'include' }),
      fetchVendorPrice(vendorId),
    ]);

    const recordsData = await recordsRes.json();
    setRecords(recordsData.records || []);
    fetchTotalAmount(vendorId);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const existingRecord = records.find((r) => {
      const recordDate = parseISO(r.date);
      return recordDate.toDateString() === date.toDateString();
    });
    setEditQuantity(existingRecord?.quantity ?? selectedVendor?.default_quantity ?? 1);
    setDialogOpen(true);
  };

  const handleSaveQuantity = async () => {
    if (!selectedVendor || !selectedDate) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/milk-records/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          vendor_id: selectedVendor.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          quantity: parseFloat(editQuantity),
        }),
      });

      if (res.ok) {
        toast.success('Quantity updated!');
        setDialogOpen(false);
        const recordsRes = await fetch(`${API_BASE_URL}/api/milk-records/?vendor_id=${selectedVendor.id}`, {
          credentials: 'include',
        });
        const recordsData = await recordsRes.json();
        setRecords(recordsData.records || []);
        fetchTotalAmount(selectedVendor.id);
      } else {
        toast.error('Failed to update quantity');
      }
    } catch {
      toast.error('Failed to update quantity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Milk Calendar</h1>
        <p className="text-muted-foreground">
          View and update your daily milk quantities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Vendor</CardTitle>
          <CardDescription>
            Choose a vendor to view their calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleVendorSelect}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a vendor" />
            </SelectTrigger>
            <SelectContent>
              {subscriptions.map((sub) => (
                <SelectItem key={sub.id} value={sub.id.toString()}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedVendor && (
        <>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount for {selectedVendor.name}</p>
                  <p className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-semibold">₹{currentPrice}/L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MilkCalendar
            records={records}
            defaultQuantity={selectedVendor.default_quantity || 1}
            pricePerLiter={currentPrice}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Update Quantity for {selectedDate && format(selectedDate, 'PPP')}
            </DialogTitle>
            <DialogDescription>
              Adjust the milk quantity for this day. Set to 0 to skip delivery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantity (Liters)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Set to 0 to skip milk for this day
              </p>
              <p className="text-sm font-medium">
                Amount: ₹{(parseFloat(editQuantity) * currentPrice).toFixed(2)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuantity} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
