import { Navigate, Route, Routes } from 'react-router-dom';
import { useSocketLifecycle } from '@/hooks/use-socket-lifecycle';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/layout/protected-route';
import LoginPage from '@/pages/login-page';
import RegisterPage from '@/pages/register-page';
import ChatsListPage from '@/pages/chats-list-page';
import ChatRoomPage from '@/pages/chat-room-page';
import SearchPage from '@/pages/search-page';
import ProfilePage from '@/pages/profile-page';

export default function App() {
  useSocketLifecycle();

  return (
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

      <Route path="*" element={<Navigate to="/chats" replace />} />
    </Routes>
  );
}
