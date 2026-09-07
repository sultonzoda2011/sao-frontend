import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { usersApi } from '@/lib/users-api';
import { useAuthStore } from '@/store/auth-store';
import { makeEditProfileSchema, type EditProfileFormValues } from '@/lib/validation';

export function EditProfileDialog() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(makeEditProfileSchema(t)),
    defaultValues: {
      displayName: user?.displayName ?? '',
      username: user?.username ?? '',
      bio: user?.bio ?? '',
    },
  });

  async function onSubmit(values: EditProfileFormValues) {
    setServerError(null);
    try {
      const updated = await usersApi.updateProfile(values);
      updateUser(updated);
      setOpen(false);
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? t('profile.editDialog.failed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="glass" className="w-full justify-start">
          {t('profile.editProfile')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('profile.editDialog.title')}</DialogTitle>
          <DialogDescription>{t('profile.editDialog.subtitle')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            label={t('profile.editDialog.displayName')}
            htmlFor="displayName"
            error={errors.displayName?.message}
          >
            <Input id="displayName" {...register('displayName')} />
          </FormField>

          <FormField
            label={t('profile.editDialog.username')}
            htmlFor="username"
            error={errors.username?.message}
          >
            <Input id="username" {...register('username')} />
          </FormField>

          <FormField label={t('profile.editDialog.bio')} htmlFor="bio" error={errors.bio?.message}>
            <Textarea id="bio" rows={3} maxLength={160} {...register('bio')} />
          </FormField>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? t('profile.editDialog.saving') : t('profile.editDialog.save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
