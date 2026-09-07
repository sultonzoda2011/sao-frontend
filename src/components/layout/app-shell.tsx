import { Outlet } from 'react-router-dom';
import { BottomNav } from './bottom-nav';
import { Sidebar } from './sidebar';

export function AppShell() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-6xl md:gap-2">
      <Sidebar />
      <div className="mx-auto w-full max-w-md flex-1 overflow-hidden md:max-w-2xl md:border-x md:border-white/8">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
