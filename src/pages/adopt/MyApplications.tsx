import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/client';
import type { AdoptionApplication } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function MyApplications() {
  const [apps, setApps] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(setApps)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">Track the status of your adoption applications</p>
        </div>
        <Link
          to="/adopt"
          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
        >
          &larr; Browse Listings
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading applications..." />
      ) : apps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">You haven&rsquo;t applied for any adoptions yet.</p>
          <Link
            to="/adopt"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Browse available animals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start"
            >
              <div>
                <Link
                  to={`/adopt/${a.adoption_id}`}
                  className="font-semibold text-amber-700 hover:underline"
                >
                  View Listing
                </Link>
                <p className="text-sm text-gray-600 mt-1">{a.why_adopt}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Applied {new Date(a.created_at).toLocaleDateString('en-IN')}
                </p>
                {a.admin_notes && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    Admin notes: {a.admin_notes}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[a.status] ?? 'bg-gray-100 text-gray-700'}`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
