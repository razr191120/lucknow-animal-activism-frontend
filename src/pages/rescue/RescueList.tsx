import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLaapRescues } from '../../api/client';
import type { LaapRescue } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_OPTIONS = ['all', 'open', 'in_progress', 'resolved'] as const;

const urgencyColor: Record<string, string> = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const statusColor: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
};

export default function RescueList() {
  const [rescues, setRescues] = useState<LaapRescue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    listLaapRescues(filter === 'all' ? undefined : filter)
      .then(setRescues)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rescue Cases</h1>
          <p className="text-gray-500 mt-1">Report and track animal rescue cases</p>
        </div>
        <Link
          to="/rescue/report"
          className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-md"
        >
          + Report New Case
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading rescue cases..." />
      ) : rescues.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No rescue cases found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rescues.map((r) => (
            <Link
              key={r.id}
              to={`/rescue/${r.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              {r.photo_urls[0] && (
                <img
                  src={r.photo_urls[0]}
                  alt={r.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${urgencyColor[r.urgency] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {r.urgency}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[r.status] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {r.location_address}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Reported by {r.creator_full_name ?? 'Unknown'} &middot;{' '}
                  {new Date(r.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
