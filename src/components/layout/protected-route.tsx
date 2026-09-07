import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { isTokenExpired } from '@/lib/jwt';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearSession = useAuthStore((s) => s.clearSession);
  const location = useLocation();

  if (!accessToken || isTokenExpired(accessToken)) {
    if (accessToken) clearSession();
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?from=${from}`} replace />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (accessToken && !isTokenExpired(accessToken)) return <Navigate to="/chats" replace />;
  return <>{children}</>;
}
