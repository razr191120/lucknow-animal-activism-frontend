import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLaapAdoptions } from '../../api/client';
import type { LaapAdoption } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { LA } from './paths';

export default function AdoptionList() {
  const { user } = useAuth();
  const [items, setItems] = useState<LaapAdoption[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLaapAdoptions()
      .then(setItems)
      .catch(() => setError('Could not load adoptions.'))
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
          <h1 className="text-2xl font-black text-laap-950">L.A.A.P — Adoptions</h1>
          <p className="text-sm text-earth-700">
            Animals looking for a loving home in Lucknow.
          </p>
        </div>
        {user && (
          <Link
            to={LA.adoptionNew}
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
        {items.map((a) => (
          <li
            key={a.id}
            className="flex gap-4 rounded-xl border border-laap-200 bg-white p-4 shadow-sm"
          >
            {a.photo_urls[0] ? (
              <img
                src={a.photo_urls[0]}
                alt=""
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-laap-100 text-2xl">
                🐾
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                to={LA.adoption(a.id)}
                className="font-bold text-laap-900 hover:underline"
              >
                {a.title}
              </Link>
              {a.animal_name && (
                <p className="text-sm text-earth-700">{a.animal_name}</p>
              )}
              <p className="mt-1 line-clamp-2 text-sm text-earth-700">
                {a.description || '—'}
              </p>
              <p className="mt-2 text-xs text-earth-700">
                By {a.creator_full_name || 'Member'} · {a.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && !error && (
        <p className="text-earth-700">No adoption listings yet.</p>
      )}
    </div>
  );
}
