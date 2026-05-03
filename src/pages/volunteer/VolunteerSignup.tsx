import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  volunteerSignup,
  getVolunteerProfile,
  updateVolunteerProfile,
} from '../../api/client';
import type { Volunteer } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerSignup() {
  const { user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    phone: '',
    skills: '',
    availability: '',
    area: '',
  });

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getVolunteerProfile()
      .then((v) => {
        setProfile(v);
        setForm({
          phone: v.phone ?? '',
          skills: v.skills ?? '',
          availability: v.availability ?? '',
          area: v.area ?? '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (profile) {
        const updated = await updateVolunteerProfile(form);
        setProfile(updated);
        setSuccess('Profile updated!');
      } else {
        const created = await volunteerSignup(form);
        setProfile(created);
        setSuccess('You are now a volunteer!');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  const badgeColor: Record<string, string> = {
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    silver: 'bg-gray-100 text-gray-700 border-gray-400',
    bronze: 'bg-orange-100 text-orange-800 border-orange-400',
    none: 'bg-gray-50 text-gray-500 border-gray-300',
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  const returnTo = encodeURIComponent(
    `${location.pathname}${location.search}`,
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {!user && (
        <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-900">
          <p className="font-medium">Sign in to create or manage your volunteer profile</p>
          <p className="mt-1 text-purple-800/90">
            <Link to={`/login?returnUrl=${returnTo}`} className="font-semibold underline hover:no-underline">
              Log in
            </Link>
            {' · '}
            <Link to={`/signup?returnUrl=${returnTo}`} className="font-semibold underline hover:no-underline">
              Sign up
            </Link>
          </p>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile ? 'Volunteer Profile' : 'Join as Volunteer'}
          </h1>
          <p className="text-gray-500 mt-1">
            {profile
              ? 'Update your volunteer information'
              : 'Sign up to help Lucknow\'s street animals'}
          </p>
        </div>
        {profile && (
          <div className="flex gap-2 text-sm">
            <Link to="/volunteer/assignments" className="text-purple-600 hover:text-purple-800 font-medium">
              Assignments
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/volunteer/activity" className="text-purple-600 hover:text-purple-800 font-medium">
              Activity
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/volunteer/leaderboard" className="text-purple-600 hover:text-purple-800 font-medium">
              Leaderboard
            </Link>
          </div>
        )}
      </div>

      {profile && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 font-medium">
              Total Hours: <span className="font-bold">{profile.total_hours.toFixed(1)}</span>
            </p>
            <p className="text-sm text-purple-600 capitalize mt-1">
              Status: {profile.status}
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-bold border capitalize ${badgeColor[profile.badge] ?? badgeColor.none}`}
          >
            {profile.badge === 'none' ? 'No Badge' : `${profile.badge} Badge`}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-6">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        aria-disabled={!user}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. Animal handling, First aid, Driving"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <input
              name="availability"
              value={form.availability}
              onChange={handleChange}
              placeholder="e.g. Weekends, Evenings"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. Gomti Nagar, Hazratganj"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !user}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-md"
        >
          {saving ? 'Saving...' : profile ? 'Update Profile' : 'Sign Up as Volunteer'}
        </button>
      </form>
    </div>
  );
}
