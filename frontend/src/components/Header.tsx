'use client';

import { User } from '@/types';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    api.clearToken();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search content..."
          className="w-80 bg-surface border border-border rounded-lg px-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-surface transition-colors">
          <span className="text-lg">🔔</span>
        </button>

        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
          )}
          <div className="text-sm">
            <p className="font-medium">{user?.full_name || 'User'}</p>
            <p className="text-muted text-xs">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}