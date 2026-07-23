import * as React from 'react';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div ref={ref} className={cn('grid gap-2', className)} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              selectedValue,
              onSelect: handleChange,
            })
          : child
      )}
    </div>
  );
});
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(({ className, value, id, selectedValue, onSelect, ...props }, ref) => {
  const isSelected = selectedValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isSelected}
      id={id || value}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => onSelect?.(value)}
      {...props}
    >
      {isSelected && (
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      )}
    </button>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
