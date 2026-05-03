import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../../api/client';
import type { LeaderboardEntry } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';

const badgeIcon: Record<string, string> = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
  none: '',
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading leaderboard..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Leaderboard</h1>
          <p className="text-gray-500 mt-1">Top volunteers by hours contributed</p>
        </div>
        <Link
          to="/volunteer"
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          &larr; Profile
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No volunteers have logged hours yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-purple-600 uppercase w-16">
                  Rank
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-purple-600 uppercase">
                  Volunteer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-purple-600 uppercase">
                  Area
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-purple-600 uppercase">
                  Hours
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-purple-600 uppercase w-20">
                  Badge
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((e, i) => (
                <tr key={e.volunteer_id} className={i < 3 ? 'bg-purple-50/30' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-bold text-gray-700">
                    #{i + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {e.full_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {e.area ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-purple-700 text-right">
                    {e.total_hours.toFixed(1)}h
                  </td>
                  <td className="px-4 py-3 text-center text-xl">
                    {badgeIcon[e.badge] || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-2">Badge Thresholds</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>🥉 <span className="font-medium">Bronze</span> &mdash; 10+ hours</li>
          <li>🥈 <span className="font-medium">Silver</span> &mdash; 50+ hours</li>
          <li>🥇 <span className="font-medium">Gold</span> &mdash; 100+ hours</li>
        </ul>
      </div>
    </div>
  );
}
