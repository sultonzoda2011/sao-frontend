import { Outlet } from 'react-router-dom';
import { BottomNav } from './bottom-nav';

export function AppShell() {
  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
