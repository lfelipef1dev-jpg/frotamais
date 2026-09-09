import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

const DEMO_EMAIL = 'frotas@frotamais.com.br';
const DEMO_PASSWORD = 'frotas12345';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: loginEmail,
        password: loginPassword,
      });
      if (signInError) {
        setError('Email ou senha inválidos.');
      } else {
        window.location.href = '/app/dashboard';
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doLogin(email, password);
  };

  const handleDemo = async () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    // Cria a conta demo se nao existir
    setLoading(true);
    setError('');
    try {
      await authClient.signUp.email({
        name: 'Operador Frotamais',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      await doLogin(DEMO_EMAIL, DEMO_PASSWORD);
    } catch {
      await doLogin(DEMO_EMAIL, DEMO_PASSWORD);
    }
  };

  return (
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
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary outline-none transition"
          placeholder="seu@email.com"
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
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary outline-none transition"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-sm text-brand-danger" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-primary px-4 py-3 font-semibold text-white transition hover:bg-brand-primary-600 disabled:opacity-60 min-h-12 shadow-sm"
      >
        {loading ? 'Entrando...' : 'Entrar no painel'}
      </button>

      <button
        type="button"
        onClick={handleDemo}
        disabled={loading}
        className="w-full rounded-lg border border-brand-border px-4 py-3 font-medium text-brand-text-secondary transition hover:bg-brand-bg disabled:opacity-60 min-h-12"
      >
        Usar conta de demonstração
      </button>

      <p className="text-center text-xs text-brand-text-light">
        A demonstração utiliza dados simulados e não gera documentos fiscais.
      </p>
    </form>
  );
}
