import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, signupLaap } from '../api/client';
import { useAuth } from '../context/AuthContext';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function Signup() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar_number: '',
    pan_number: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const aadhaar = form.aadhaar_number.replace(/\s/g, '');
    const pan = form.pan_number.replace(/\s/g, '').toUpperCase();
    const hasKyc = aadhaar.length > 0 || pan.length > 0;
    if (hasKyc) {
      if (aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
        setError('For L.A.A.P KYC, enter exactly 12 digits for Aadhaar (or leave both blank).');
        return;
      }
      if (pan.length !== 10 || !/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) {
        setError('For L.A.A.P KYC, enter a valid PAN (e.g. ABCDE1234F) or leave both blank.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = hasKyc
        ? await signupLaap(
            form.email,
            form.full_name,
            form.password,
            aadhaar,
            pan,
          )
        : await signup(form.email, form.full_name, form.password);
      setAuth(res.access_token, res.user);
      navigate('/');
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { detail?: string | { msg: string }[] } };
      };
      const d = ax.response?.data?.detail;
      if (Array.isArray(d)) {
        setError(d.map((x) => x.msg).join(' '));
      } else if (typeof d === 'string') {
        setError(d);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-50 via-white to-leaf-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">💧</span>
          <h1 className="text-3xl font-extrabold text-water-900">
            Join the platform
          </h1>
          <p className="text-gray-500 mt-2">
            One account for water bowl drives and L.A.A.P. Use social sign-in or email below.
            Optional Aadhaar &amp; PAN for L.A.A.P identity when registering with password.
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
              navigate('/');
            }}
            onError={(m) => setError(m)}
          />

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Email signup</span>
            </div>
          </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="you@example.com"
            />
          </div>

          <div className="border-t border-water-100 pt-4 space-y-4">
            <p className="text-sm font-semibold text-water-900">
              L.A.A.P — optional Aadhaar &amp; PAN
            </p>
            <p className="text-xs text-gray-500">
              Leave both empty for a standard account. If you fill either, both
              must be valid; we use the L.A.A.P signup endpoint and store KYC on
              your user record.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar (12 digits, optional)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={14}
                value={form.aadhaar_number}
                onChange={(e) =>
                  setForm({ ...form, aadhaar_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-water-400 outline-none"
                placeholder="Leave blank if not needed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN (optional)
              </label>
              <input
                type="text"
                maxLength={10}
                value={form.pan_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pan_number: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-water-400 outline-none"
                placeholder="ABCDE1234F"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-water-600 to-leaf-500 text-white font-bold rounded-xl hover:from-water-700 hover:to-leaf-600 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-water-600 hover:text-water-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
}
