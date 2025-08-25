import { useState } from 'react';
import { login } from '../hooks/useAuth';

type Props = { onSuccess?: () => void };

export default function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || 'Ошибка входа');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl shadow-lg p-6 space-y-4 bg-white"
      >
        <h1 className="text-2xl font-semibold text-center">Вход в DiscountHub</h1>

        {error && (
          <div className="text-sm border rounded p-2 border-red-300 bg-red-50">{error}</div>
        )}

        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border p-2 outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Пароль</label>
          <input
            type="password"
            className="w-full rounded-lg border p-2 outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl p-3 font-medium shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
