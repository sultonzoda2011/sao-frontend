import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white shadow-[0_8px_20px_-6px_rgba(124,77,255,0.55)] hover:bg-primary-hover',
        glass: 'glass text-ink hover:bg-white/10',
        ghost: 'text-mist hover:text-ink hover:bg-white/5',
        danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
        link: 'text-primary-soft underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-9 px-4 text-[13px] rounded-xl',
        icon: 'h-10 w-10 rounded-full',
        lg: 'h-14 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
