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
import { FormField } from '@/components/ui/form-field';
import { usersApi } from '@/lib/users-api';
import { makeChangePasswordSchema, type ChangePasswordFormValues } from '@/lib/validation';

export function ChangePasswordDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(makeChangePasswordSchema(t)),
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    setServerError(null);
    try {
      await usersApi.updatePassword(values);
      setSuccess(true);
      reset();
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 900);
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? t('profile.passwordDialog.failed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="glass" className="w-full justify-start">
          {t('profile.changePassword')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('profile.passwordDialog.title')}</DialogTitle>
          <DialogDescription>{t('profile.passwordDialog.subtitle')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            label={t('profile.passwordDialog.current')}
            htmlFor="currentPassword"
            error={errors.currentPassword?.message}
          >
            <Input id="currentPassword" type="password" {...register('currentPassword')} />
          </FormField>

          <FormField
            label={t('profile.passwordDialog.new')}
            htmlFor="newPassword"
            error={errors.newPassword?.message}
          >
            <Input id="newPassword" type="password" {...register('newPassword')} />
          </FormField>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}
          {success && <p className="text-sm text-online">{t('profile.passwordDialog.success')}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? t('profile.passwordDialog.saving') : t('profile.passwordDialog.save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
