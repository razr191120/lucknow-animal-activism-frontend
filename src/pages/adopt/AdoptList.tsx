import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLaapAdoptions } from '../../api/client';
import type { LaapAdoption } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_OPTIONS = ['all', 'open', 'fulfilled'] as const;

const statusColor: Record<string, string> = {
  open: 'bg-green-100 text-green-800',
  fulfilled: 'bg-blue-100 text-blue-800',
};

export default function AdoptList() {
  const [listings, setListings] = useState<LaapAdoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    listLaapAdoptions(filter === 'all' ? undefined : filter)
      .then(setListings)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adopt an Animal</h1>
          <p className="text-gray-500 mt-1">Browse animals available for adoption</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/adopt/applications"
            className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            My Applications
          </Link>
          <Link
            to="/adopt/post"
            className="inline-flex items-center px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md"
          >
            + Post for Adoption
          </Link>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading listings..." />
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No adoption listings found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((a) => (
            <Link
              key={a.id}
              to={`/adopt/${a.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              {a.photo_urls[0] ? (
                <img
                  src={a.photo_urls[0]}
                  alt={a.animal_name ?? a.title}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-amber-50 flex items-center justify-center text-5xl">
                  🐾
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[a.status] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {a.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                  {a.animal_name ?? a.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                {a.location_hint && (
                  <p className="text-xs text-gray-400 mt-2">{a.location_hint}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
