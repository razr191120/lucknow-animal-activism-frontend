import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDonationRecords, getDonationStats } from '../../api/client';
import type { DonationRecord, DonationStats } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function DonationHistory() {
  const [records, setRecords] = useState<DonationRecord[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listDonationRecords(), getDonationStats()])
      .then(([r, s]) => {
        setRecords(r);
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading donation history..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
          <p className="text-gray-500 mt-1">All recorded donations</p>
        </div>
        <Link
          to="/donate"
          className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md"
        >
          + Record Donation
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-extrabold text-green-700">
              ₹{Number(stats.total_amount_inr).toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-green-600 font-medium mt-1">Total Donations</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-extrabold text-green-700">{stats.donation_count}</p>
            <p className="text-sm text-green-600 font-medium mt-1">Total Records</p>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No donations recorded yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Receipt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Donor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Purpose</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">
                    {r.receipt_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{r.donor_name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">
                    ₹{Number(r.amount_inr).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                    {r.payment_mode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.purpose ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(r.date).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
