import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLaapDonations } from '../../api/client';
import type { LaapDonation } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { LA } from './paths';

export default function DonationList() {
  const { user } = useAuth();
  const [items, setItems] = useState<LaapDonation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLaapDonations()
      .then(setItems)
      .catch(() => setError('Could not load donation requests.'))
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
            L.A.A.P — Donation appeals
          </h1>
          <p className="text-sm text-earth-700">
            Food, medicine, transport — how you can help safely.
          </p>
        </div>
        {user && (
          <Link
            to={LA.donationNew}
            className="rounded-xl bg-laap-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-laap-700"
          >
            New appeal
          </Link>
        )}
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <ul className="space-y-4">
        {items.map((d) => (
          <li
            key={d.id}
            className="flex gap-4 rounded-xl border border-laap-200 bg-white p-4 shadow-sm"
          >
            {d.photo_urls[0] ? (
              <img
                src={d.photo_urls[0]}
                alt=""
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-laap-100 text-2xl">
                ❤️
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                to={LA.donation(d.id)}
                className="font-bold text-laap-900 hover:underline"
              >
                {d.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-earth-700">
                {d.items_or_need_summary || d.description || '—'}
              </p>
              <p className="mt-2 text-xs text-earth-700">
                By {d.creator_full_name || 'Member'} · {d.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && !error && (
        <p className="text-earth-700">No donation appeals yet.</p>
      )}
    </div>
  );
}
