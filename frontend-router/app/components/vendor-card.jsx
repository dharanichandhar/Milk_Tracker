import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserMinus } from 'lucide-react';

export default function VendorCard({
  vendor,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  loading,
  showSubscribe = true,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={vendor.image_url} alt={vendor.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {vendor.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{vendor.name}</h3>
            <Badge variant="secondary">₹{vendor.price_per_liter || 60}/L</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{vendor.total_customers || 0} customers</span>
          {isSubscribed && <Badge variant="success">Subscribed</Badge>}
        </div>
      </CardContent>
      {showSubscribe && (
        <CardFooter className="p-4 pt-0">
          {isSubscribed ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={onUnsubscribe}
              disabled={loading}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              {loading ? 'Unsubscribing...' : 'Unsubscribe'}
            </Button>
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={onSubscribe}
              disabled={loading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
