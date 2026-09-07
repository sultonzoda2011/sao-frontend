import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-ink placeholder:text-mist/70 outline-none transition-colors',
        'focus:border-primary-soft/50 focus:bg-white/[0.07]',
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
