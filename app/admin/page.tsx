'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/certificates');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo + Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-surface">
            <Image
              src="/logo.png"
              alt="Agronavis"
              width={64}
              height={64}
              className="h-8 w-8"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Certificate Admin
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Sign in to manage certificates
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <div className="md-field">
              <input
                id="admin-username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder=" "
                autoComplete="username"
                className="md-input peer"
              />
              <label htmlFor="admin-username" className="md-label">
                Username <span className="text-accent">*</span>
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="md-field">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                autoComplete="current-password"
                className="md-input peer pr-12"
              />
              <label htmlFor="admin-password" className="md-label">
                Password <span className="text-accent">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-ink-muted hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 rounded-md border border-error/30 bg-error/10 px-3 py-2.5 text-sm text-error"
              role="alert"
            >
              <Lock size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="md-state flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-on-accent transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Lock size={15} />
                Sign in
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-ink-faint">
          Access is restricted to authorised Agronavis administrators.
        </p>
      </div>
    </div>
  );
}
