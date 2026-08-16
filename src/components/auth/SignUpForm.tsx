import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('Senha deve ter no minimo 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setError(error.message ?? 'Erro ao cadastrar');
      } else {
        window.location.href = '/app/dashboard';
      }
    } catch {
      setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text mb-1">
          Nome
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
        />
      </div>

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
          Senha (minimo 8 caracteres)
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
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
        {loading ? 'Cadastrando...' : 'Criar conta de demonstracao'}
      </button>

      <p className="text-center text-sm text-brand-text-secondary">
        Conta de demonstracao. Nenhum dado real e coletado.
      </p>
    </form>
  );
}
