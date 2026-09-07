import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { initialsFrom } from '@/lib/format';
import { usersApi } from '@/lib/users-api';
import { useAuthStore } from '@/store/auth-store';

export function AvatarUploader() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const name = user?.displayName || user?.username || 'Вы';

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await usersApi.uploadAvatar(file);
      updateUser({ avatarUrl: updated.avatarUrl });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="relative mx-auto h-24 w-24">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user?.avatarUrl ?? undefined} alt={name} />
        <AvatarFallback className="text-2xl">{initialsFrom(name)}</AvatarFallback>
      </Avatar>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_16px_-4px_rgba(124,77,255,0.55)]"
        aria-label={t('profile.changeAvatar')}
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
