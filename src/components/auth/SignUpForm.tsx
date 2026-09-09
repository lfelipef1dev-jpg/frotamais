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

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (err) {
        setError(err.message ?? 'Erro ao criar conta. Tente outro email.');
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
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary outline-none transition"
          placeholder="Seu nome"
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
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary outline-none transition"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-1">
          Senha (mínimo 8 caracteres)
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
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
        {loading ? 'Criando conta...' : 'Criar conta de demonstração'}
      </button>

      <p className="text-center text-xs text-brand-text-light">
        Conta de demonstração. Nenhum dado real é coletado.
      </p>
    </form>
  );
}
