import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';
import { makeLoginSchema, type LoginFormValues } from '@/lib/validation';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(makeLoginSchema(t)),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const res = await authApi.login(values);
      setSession(res.user, res.accessToken);
      const from = searchParams.get('from');
      navigate(from && from.startsWith('/') ? from : '/chats', { replace: true });
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? t('auth.loginFailed'));
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label={t('auth.loginOrUsername')} htmlFor="login" error={errors.login?.message}>
          <Input
            id="login"
            autoComplete="username"
            placeholder={t('auth.emailPlaceholder')}
            {...register('login')}
          />
        </FormField>

        <FormField label={t('auth.password')} htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder={t('auth.passwordPlaceholder')}
            {...register('password')}
          />
        </FormField>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        </Button>

        <p className="text-center text-sm text-mist">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-primary-soft hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
