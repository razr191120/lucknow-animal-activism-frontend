import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLaapRescues } from '../../api/client';
import type { LaapRescue } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { LA } from './paths';

export default function RescueList() {
  const { user } = useAuth();
  const [items, setItems] = useState<LaapRescue[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLaapRescues()
      .then(setItems)
      .catch(() => setError('Could not load rescues.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-earth-700">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-laap-950">
            L.A.A.P — Urgent help &amp; rescue
          </h1>
          <p className="text-sm text-earth-700">
            On-the-ground situations that need responders fast.
          </p>
        </div>
        {user && (
          <Link
            to={LA.rescueNew}
            className="rounded-xl bg-laap-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-laap-700"
          >
            New request
          </Link>
        )}
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <ul className="space-y-4">
        {items.map((r) => (
          <li
            key={r.id}
            className="flex gap-4 rounded-xl border border-laap-200 bg-white p-4 shadow-sm"
          >
            {r.photo_urls[0] ? (
              <img
                src={r.photo_urls[0]}
                alt=""
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-red-50 text-2xl">
                🚨
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="rounded bg-laap-100 px-2 py-0.5 text-xs font-bold uppercase text-laap-800">
                {r.urgency}
              </span>
              <Link
                to={LA.rescue(r.id)}
                className="mt-1 block font-bold text-laap-900 hover:underline"
              >
                {r.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-earth-700">
                {r.location_address}
              </p>
              <p className="mt-2 text-xs text-earth-700">
                By {r.creator_full_name || 'Member'} · {r.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && !error && (
        <p className="text-earth-700">No rescue requests yet.</p>
      )}
    </div>
  );
}
