import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../api/client';
import { useAuth } from '../context/AuthContext';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuth();
  const returnUrl = searchParams.get('returnUrl');
  const afterAuthPath =
    returnUrl &&
    returnUrl.startsWith('/') &&
    !returnUrl.startsWith('//')
      ? returnUrl
      : '/';
  const signupHref =
    returnUrl &&
    returnUrl.startsWith('/') &&
    !returnUrl.startsWith('//')
      ? `/signup?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      setAuth(res.access_token, res.user);
      navigate(afterAuthPath, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Login failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-50 via-white to-leaf-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">💧</span>
          <h1 className="text-3xl font-extrabold text-water-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in with email or Google, Facebook, or Instagram (where configured).
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-water-200 shadow-xl p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <SocialLoginButtons
            onSuccess={(data) => {
              setAuth(data.access_token, data.user);
              navigate(afterAuthPath, { replace: true });
            }}
            onError={(m) => setError(m)}
          />

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Email</span>
            </div>
          </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-water-600 to-leaf-500 text-white font-bold rounded-xl hover:from-water-700 hover:to-leaf-600 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to={signupHref}
              className="text-water-600 hover:text-water-800 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
}
