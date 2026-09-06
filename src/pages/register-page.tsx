import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.register(form);
      setSession(res.user, res.accessToken);
      navigate('/chats', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Не удалось зарегистрироваться.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">Логин</Label>
          <Input
            id="username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            placeholder="kirito_2026"
            required
            minLength={3}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="displayName">Имя (необязательно)</Label>
          <Input
            id="displayName"
            value={form.displayName}
            onChange={(e) => update('displayName', e.target.value)}
            placeholder="Как вас видят другие"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Минимум 6 символов"
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          {loading ? 'Создаём аккаунт…' : 'Создать аккаунт'}
        </Button>

        <p className="text-center text-sm text-mist">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-semibold text-cyan hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
