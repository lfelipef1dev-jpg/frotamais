import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

export default function SignInForm() {
  const [email, setEmail] = useState('frotas@frotamais.com.br');
  const [password, setPassword] = useState('frotas12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Tenta cadastrar; se ja existir, ignora e faz login
      await authClient.signUp.email({
        name: 'Operador Frotamais',
        email,
        password,
      });

      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError('Erro ao entrar. Tente novamente.');
      } else {
        window.location.href = '/app/dashboard';
      }
    } catch {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError('Erro ao entrar. Tente novamente.');
      } else {
        window.location.href = '/app/dashboard';
      }
    } finally {
      setLoading(false);
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
        className="w-full rounded-lg bg-brand-accent px-4 py-3 font-semibold text-brand-bg transition hover:bg-brand-accent-hover disabled:opacity-60 min-h-12"
      >
        {loading ? 'Entrando...' : 'Entrar no painel'}
      </button>

      <p className="text-center text-sm text-brand-text-secondary">
        Credenciais de teste preenchidas. Clique em entrar para acessar.
      </p>
    </form>
  );
}
