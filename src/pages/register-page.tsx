import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';
import { makeRegisterSchema, type RegisterFormValues } from '@/lib/validation';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(makeRegisterSchema(t)),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      const res = await authApi.register(values);
      setSession(res.user, res.accessToken);
      navigate('/chats', { replace: true });
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? t('auth.registerFailed'));
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label={t('auth.email')} htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.emailPlaceholder')}
            {...register('email')}
          />
        </FormField>

        <FormField label={t('auth.username')} htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            autoComplete="username"
            placeholder={t('auth.usernamePlaceholder')}
            {...register('username')}
          />
        </FormField>

        <FormField label={t('auth.displayNameOptional')} htmlFor="displayName">
          <Input
            id="displayName"
            placeholder={t('auth.displayNamePlaceholder')}
            {...register('displayName')}
          />
        </FormField>

        <FormField label={t('auth.password')} htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.passwordMinPlaceholder')}
            {...register('password')}
          />
        </FormField>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? t('auth.creatingAccount') : t('auth.createAccount')}
        </Button>

        <p className="text-center text-sm text-mist">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-primary-soft hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
