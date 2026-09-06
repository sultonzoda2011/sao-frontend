import { Check, CheckCheck, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Message } from '@/types';

function bubbleTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({
  message,
  isOwn,
  onEdit,
  onDelete,
}: {
  message: Message;
  isOwn: boolean;
  onEdit: (message: Message) => void;
  onDelete: (message: Message) => void;
}) {
  const bubble = (
    <div
      className={cn(
        'max-w-[78%] rounded-[22px] px-4 py-2.5 text-[15px] leading-snug animate-rise',
        isOwn
          ? 'accent-gradient rounded-br-md text-[#050710]'
          : 'glass-soft rounded-bl-md text-ink',
        message.deleted && 'italic opacity-60',
      )}
    >
      <p className="whitespace-pre-wrap break-words">
        {message.deleted ? 'Сообщение удалено' : message.text}
      </p>
      <div
        className={cn(
          'mt-1 flex items-center justify-end gap-1 text-[10.5px]',
          isOwn ? 'text-[#050710]/70' : 'text-mist',
        )}
      >
        {message.isEdited && !message.deleted && <span>изменено</span>}
        <span>{bubbleTime(message.createdAt)}</span>
        {isOwn &&
          !message.deleted &&
          (message.status === 'READ' ? (
            <CheckCheck className="h-3.5 w-3.5" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          ))}
      </div>
    </div>
  );

  if (!isOwn || message.deleted) {
    return <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>{bubble}</div>;
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-left">{bubble}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(message)}>
            <Pencil className="h-4 w-4" /> Изменить
          </DropdownMenuItem>
          <DropdownMenuItem destructive onSelect={() => onDelete(message)}>
            <Trash2 className="h-4 w-4" /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
