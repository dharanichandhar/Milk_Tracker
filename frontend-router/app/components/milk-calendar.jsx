import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO, isBefore, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MilkCalendar({
  records = [],
  defaultQuantity = 1,
  pricePerLiter = 60,
  onDateClick,
  selectedDate,
}) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getRecordForDate = (date) => {
    return records.find((record) => {
      const recordDate = parseISO(record.date);
      return isSameDay(recordDate, date);
    });
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = monthStart.getDay();
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calculateTotalAmount = () => {
    return records.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  };

  const totalAmount = calculateTotalAmount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}
          {days.map((day) => {
            const record = getRecordForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const isFuture = isAfter(day, today);
            const isPast = isBefore(day, today) || isSameDay(day, today);

            let bgColor = '';
            let textColor = '';
            let borderColor = '';

            if (!isFuture) {
              if (record) {
                if (record.quantity == 0) {
                  bgColor = 'bg-red-100';
                  textColor = 'text-red-700';
                } else if (record.quantity > defaultQuantity) {
                  bgColor = 'bg-yellow-100';
                  textColor = 'text-yellow-800';
                } else if (record.quantity < defaultQuantity && record.quantity > 0) {
                  bgColor = 'bg-orange-100';
                  textColor = 'text-orange-700';
                } else if (!record.is_override) {
                  borderColor = 'border-2 border-green-400';
                }
              } else {
                borderColor = 'border border-dashed border-gray-300';
              }
            }

            const displayQuantity = record ? record.quantity : defaultQuantity;
            const displayAmount = record
              ? record.amount
              : (defaultQuantity * pricePerLiter).toFixed(2);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isFuture && onDateClick?.(day)}
                disabled={isFuture}
                className={cn(
                  'min-h-[60px] rounded-lg p-2 text-left transition-colors',
                  isSelected && 'ring-2 ring-primary',
                  isCurrentDay && 'bg-accent',
                  bgColor,
                  textColor,
                  borderColor,
                  isFuture && 'opacity-40 cursor-not-allowed',
                  !record && !isFuture && !bgColor && 'hover:bg-muted'
                )}
              >
                <div className="text-sm font-medium">{format(day, 'd')}</div>
                {!isFuture && (
                  <div className="mt-1 text-xs">
                    {record?.quantity == 0 ? (
                      <span className="font-medium">Skipped</span>
                    ) : (
                      <span className="font-medium">
                        {displayQuantity}L - ₹{displayAmount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border-2 border-green-400" />
            <span>Default ({defaultQuantity}L)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-yellow-200" />
            <span>Extra Milk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-200" />
            <span>Less Milk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-200" />
            <span>Skipped</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Recorded Amount:</span>
            <span className="text-lg font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total from {records.length} recorded day{records.length !== 1 ? 's' : ''} in {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
