import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

const DEMO_EMAIL = 'demo@frotamais.expostacker.com.br';
const DEMO_PASSWORD = 'demo12345';
const DEMO_NAME = 'Operador Demo';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError(error.message ?? 'Credenciais invalidas');
      } else {
        window.location.href = '/app/dashboard';
      }
    } catch {
      setError('Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setError('');
    setDemoLoading(true);

    try {
      // Tenta cadastrar; se ja existir, faz login
      const signUpResult = await authClient.signUp.email({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (!signUpResult.error) {
        window.location.href = '/app/dashboard';
        return;
      }

      // Usuario ja existe -> faz sign in
      const signInResult = await authClient.signIn.email({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (signInResult.error) {
        setError('Nao foi possivel acessar a demo. Tente novamente.');
      } else {
        window.location.href = '/app/dashboard';
      }
    } catch {
      setError('Erro ao acessar demo. Tente novamente.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={handleDemoAccess}
        disabled={demoLoading}
        className="w-full rounded-lg bg-brand-accent px-4 py-3 font-semibold text-brand-bg transition hover:bg-brand-accent-hover disabled:opacity-60 min-h-12"
      >
        {demoLoading ? 'Acessando...' : 'Acessar demo'}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-border" />
        <span className="text-xs text-brand-text-secondary">ou entre com email</span>
        <div className="h-px flex-1 bg-brand-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-3 font-semibold text-brand-text transition hover:bg-brand-elevated disabled:opacity-60 min-h-12"
        >
          {loading ? 'Entrando...' : 'Entrar com email'}
        </button>
      </form>
    </div>
  );
}
