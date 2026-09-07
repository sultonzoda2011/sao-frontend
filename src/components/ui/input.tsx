import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-[15px] text-ink placeholder:text-mist/70 outline-none transition-colors',
        'focus:border-primary-soft/50 focus:bg-white/[0.07]',
        'disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
