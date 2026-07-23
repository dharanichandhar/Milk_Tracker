import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CustomerCard({ customer, onClick }) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{customer.name}</h3>
            <p className="text-sm text-muted-foreground">
              Customer #{customer.id}
            </p>
          </div>
          <div className="text-right">
            <Badge variant={customer.is_active ? 'success' : 'secondary'}>
              {customer.is_active ? 'Active' : 'Inactive'}
            </Badge>
            {customer.total_quantity && (
              <p className="mt-1 text-sm text-muted-foreground">
                {customer.total_quantity}L total
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
