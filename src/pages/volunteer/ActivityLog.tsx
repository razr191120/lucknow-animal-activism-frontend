import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyActivities, logVolunteerActivity } from '../../api/client';
import type { VolunteerActivity } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function ActivityLog() {
  const { user } = useAuth();
  const location = useLocation();
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    activity_type: 'general',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
  });

  async function load() {
    try {
      const data = await getMyActivities();
      setActivities(data);
    } catch {
      // Not a volunteer yet
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    load();
  }, [user]);

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await logVolunteerActivity({
        activity_type: form.activity_type,
        description: form.description || undefined,
        hours: parseFloat(form.hours),
        date: form.date,
      });
      setShowForm(false);
      setForm({
        activity_type: 'general',
        description: '',
        hours: '',
        date: new Date().toISOString().split('T')[0],
      });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Failed to log activity');
    } finally {
      setSaving(false);
    }
  }

  const typeColor: Record<string, string> = {
    rescue: 'bg-red-100 text-red-800',
    drive: 'bg-cyan-100 text-cyan-800',
    general: 'bg-gray-100 text-gray-700',
  };

  if (loading) return <LoadingSpinner message="Loading activity log..." />;

  const returnTo = encodeURIComponent(
    `${location.pathname}${location.search}`,
  );

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="mt-3 text-gray-600">
          Sign in to view and log your volunteer hours.
        </p>
        <p className="mt-4 text-sm">
          <Link
            to={`/login?returnUrl=${returnTo}`}
            className="font-semibold text-purple-600 hover:text-purple-800"
          >
            Log in
          </Link>
          {' · '}
          <Link
            to={`/signup?returnUrl=${returnTo}`}
            className="font-semibold text-purple-600 hover:text-purple-800"
          >
            Sign up
          </Link>
        </p>
        <Link
          to="/volunteer"
          className="mt-8 inline-block text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          &larr; Volunteer hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500 mt-1">Track your volunteer hours</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/volunteer"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            Profile
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-md"
          >
            + Log Hours
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6 mb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLog} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.activity_type}
                  onChange={(e) => setForm({ ...form, activity_type: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm"
                >
                  <option value="general">General</option>
                  <option value="rescue">Rescue</option>
                  <option value="drive">Drive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours *</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Log Activity'}
            </button>
          </form>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No activities logged yet. Click &quot;Log Hours&quot; to start.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${typeColor[a.activity_type] ?? typeColor.general}`}
                  >
                    {a.activity_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(a.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                {a.description && (
                  <p className="text-sm text-gray-700">{a.description}</p>
                )}
              </div>
              <span className="text-lg font-bold text-purple-700">
                {a.hours}h
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
