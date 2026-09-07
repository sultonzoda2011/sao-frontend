import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSocketLifecycle } from '@/hooks/use-socket-lifecycle';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/layout/protected-route';

const LoginPage = lazy(() => import('@/pages/login-page'));
const RegisterPage = lazy(() => import('@/pages/register-page'));
const ChatsListPage = lazy(() => import('@/pages/chats-list-page'));
const ChatRoomPage = lazy(() => import('@/pages/chat-room-page'));
const SearchPage = lazy(() => import('@/pages/search-page'));
const ProfilePage = lazy(() => import('@/pages/profile-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found-page'));

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
    </div>
  );
}

export default function App() {
  useSocketLifecycle();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/chats" element={<ChatsListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/chats/:chatId"
          element={
            <ProtectedRoute>
              <ChatRoomPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/chats" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
