import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

export default function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      window.location.href = '/sign-in';
    } catch {
      window.location.href = '/sign-in';
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-text hover:bg-brand-elevated min-h-12"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="hidden sm:inline">{name}</span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-sm font-semibold text-brand-bg"
          aria-hidden="true"
        >
          {name.charAt(0).toUpperCase()}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg border border-brand-border bg-brand-surface p-2 shadow-lg z-50"
          role="menu"
        >
          <div className="px-3 py-2 border-b border-brand-border mb-2">
            <p className="text-sm font-medium text-brand-text truncate">{name}</p>
            <p className="text-xs text-brand-text-secondary truncate">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-brand-text hover:bg-brand-elevated min-h-12"
            role="menuitem"
          >
            {loading ? 'Saindo...' : 'Sair da conta'}
          </button>
        </div>
      )}
    </div>
  );
}
