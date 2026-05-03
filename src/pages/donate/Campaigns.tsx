import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLaapDonations } from '../../api/client';
import type { LaapDonation } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_OPTIONS = ['all', 'open', 'closed'] as const;

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<LaapDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    listLaapDonations(filter === 'all' ? undefined : filter)
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation Campaigns</h1>
          <p className="text-gray-500 mt-1">Active fundraising and donation campaigns</p>
        </div>
        <Link
          to="/donate"
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          &larr; Request a donation
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading campaigns..." />
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No campaigns found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              to={`/donate/campaigns/${c.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all overflow-hidden block text-left"
            >
              {c.photo_urls[0] && (
                <img
                  src={c.photo_urls[0]}
                  alt={c.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.status}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 line-clamp-1">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                )}
                {c.target_amount_inr && (
                  <p className="text-sm font-medium text-green-700 mt-2">
                    Target: ₹{Number(c.target_amount_inr).toLocaleString('en-IN')}
                  </p>
                )}
                {c.how_to_donate && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {c.how_to_donate}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  By {c.creator_full_name ?? 'Unknown'} &middot;{' '}
                  {new Date(c.created_at).toLocaleDateString('en-IN')}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-green-600">
                  View & pledge &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
