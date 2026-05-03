import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SimpleAssignment {
  rescue_id: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function MyAssignments() {
  const [loading, setLoading] = useState(true);
  const [assignments] = useState<SimpleAssignment[]>([]);

  useEffect(() => {
    // Currently no dedicated "my assignments" endpoint; volunteers
    // can see assignments through rescue detail pages.
    setLoading(false);
  }, []);

  if (loading) return <LoadingSpinner message="Loading assignments..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-500 mt-1">Rescue and drive assignments assigned to you</p>
        </div>
        <Link
          to="/volunteer"
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          &larr; Profile
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No assignments yet.</p>
          <p className="text-sm text-gray-500">
            Check the{' '}
            <Link to="/rescue" className="text-purple-600 hover:underline">
              Rescue
            </Link>{' '}
            section for active cases, or wait for an admin to assign you.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <Link
                to={`/rescue/${a.rescue_id}`}
                className="font-semibold text-purple-700 hover:underline"
              >
                Rescue Case
              </Link>
              <p className="text-sm text-gray-500 capitalize mt-1">
                Status: {a.status.replace('_', ' ')}
              </p>
              {a.notes && <p className="text-sm text-gray-400 mt-1">{a.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
