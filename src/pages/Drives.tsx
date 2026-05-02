import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDrives, createDrive } from '../api/client';
import type { Drive } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Drives() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    planned_date: '',
  });

  useEffect(() => {
    loadDrives();
  }, []);

  function loadDrives() {
    setLoading(true);
    getDrives()
      .then(setDrives)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDrive({
        name: form.name,
        description: form.description || undefined,
        planned_date: form.planned_date,
      });
      setForm({ name: '', description: '', planned_date: '' });
      setShowForm(false);
      loadDrives();
    } catch {
      alert('Failed to create drive. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-water-900">
            Distribution Drives
          </h1>
          <p className="text-gray-500 mt-1">
            Organize and manage water bowl distribution drives
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-water-600 text-white font-semibold rounded-xl hover:bg-water-700 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {showForm ? 'Cancel' : '+ New Drive'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-water-200 shadow-lg p-6 mb-8 space-y-5"
        >
          <h2 className="text-xl font-bold text-water-800">Create New Drive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
                placeholder="e.g., Gomti Nagar Drive"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Planned Date
              </label>
              <input
                type="date"
                required
                value={form.planned_date}
                onChange={(e) =>
                  setForm({ ...form, planned_date: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow resize-none"
              placeholder="Describe the drive..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 bg-leaf-600 text-white font-semibold rounded-xl hover:bg-leaf-700 disabled:opacity-50 shadow-md transition-all duration-200"
          >
            {submitting ? 'Creating...' : 'Create Drive'}
          </button>
        </form>
      )}

      {loading ? (
        <LoadingSpinner message="Loading drives..." />
      ) : drives.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🚗</span>
          <h3 className="text-xl font-semibold text-gray-600">
            No drives yet
          </h3>
          <p className="text-gray-400 mt-2">
            Create your first distribution drive to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => (
            <Link
              key={drive.id}
              to={`/drives/${drive.id}`}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-water-300 transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-water-500 to-leaf-500 h-2" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-water-800 group-hover:text-water-600 transition-colors">
                    {drive.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    drive.status === 'completed'
                      ? 'bg-leaf-100 text-leaf-700'
                      : 'bg-water-100 text-water-700'
                  }`}>
                    {drive.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {drive.description || 'No description'}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    📅{' '}
                    {new Date(drive.planned_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    📍 {drive.address_count ?? drive.addresses?.length ?? 0} locations
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
