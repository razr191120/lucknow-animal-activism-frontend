import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getLaapDonation,
  listDonationPledges,
  createDonationPledge,
} from '../../api/client';
import type { DonationPledge, LaapDonation } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [c, setC] = useState<LaapDonation | null>(null);
  const [pledges, setPledges] = useState<DonationPledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [pledging, setPledging] = useState(false);
  const [pledgeError, setPledgeError] = useState('');

  async function load() {
    if (!id) return;
    const [camp, plist] = await Promise.all([
      getLaapDonation(id),
      listDonationPledges(id),
    ]);
    setC(camp);
    setPledges(plist);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submitPledge(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setPledging(true);
    setPledgeError('');
    try {
      await createDonationPledge(id, {
        amount_inr: amount.trim() ? parseFloat(amount) : undefined,
        message: message.trim() || undefined,
      });
      setAmount('');
      setMessage('');
      await load();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { detail?: string } } };
      setPledgeError(ax.response?.data?.detail ?? 'Could not save pledge');
    } finally {
      setPledging(false);
    }
  }

  if (loading) return <LoadingSpinner message="Loading campaign…" />;
  if (!c) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        Donation request not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/donate/campaigns" className="text-green-600 text-sm font-medium mb-6 inline-block">
        &larr; All requests
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-8">
        {c.photo_urls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {c.photo_urls.map((url, i) => (
              <img key={i} src={url} alt="" className="h-48 w-full object-cover" />
            ))}
          </div>
        )}
        <div className="p-6">
          <span className="text-xs font-semibold uppercase text-green-700">{c.status}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{c.title}</h1>
          {c.items_or_need_summary && (
            <p className="mt-3 text-gray-700 whitespace-pre-wrap">{c.items_or_need_summary}</p>
          )}
          {c.description && (
            <p className="mt-3 text-gray-600 whitespace-pre-wrap">{c.description}</p>
          )}
          {c.how_to_donate && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <h2 className="font-semibold text-green-900">How to donate</h2>
              <p className="mt-1 text-sm text-green-900 whitespace-pre-wrap">{c.how_to_donate}</p>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            {c.contact_phone && <span>Phone: {c.contact_phone}</span>}
            {c.upi_id && <span>UPI: {c.upi_id}</span>}
            {c.bank_account_hint && <span>Bank: {c.bank_account_hint}</span>}
            {c.target_amount_inr != null && c.target_amount_inr !== '' && (
              <span className="font-semibold text-green-800">
                Goal: ₹{Number(c.target_amount_inr).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Posted by {c.creator_full_name ?? '—'} · {new Date(c.created_at).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Supporter pledges</h2>
        <p className="text-sm text-gray-500 mb-4">
          After you donate via UPI/bank/etc., log a pledge here so the organiser can see community
          support (optional amount).
        </p>
        {user ? (
          <form onSubmit={submitPledge} className="space-y-3 max-w-md">
            {pledgeError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
                {pledgeError}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount pledged (₹, optional)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. Sent ₹500 via UPI"
              />
            </div>
            <button
              type="submit"
              disabled={pledging}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {pledging ? 'Saving…' : 'Log pledge'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            <Link to="/login" className="text-green-600 font-medium">Sign in</Link> to log a pledge.
          </p>
        )}

        <ul className="mt-6 divide-y divide-gray-100">
          {pledges.length === 0 ? (
            <li className="py-4 text-sm text-gray-400">No pledges yet.</li>
          ) : (
            pledges.map((p) => (
              <li key={p.id} className="py-3 flex justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800">{p.supporter_full_name ?? 'Supporter'}</p>
                  {p.message && <p className="text-sm text-gray-600">{p.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                {p.amount_inr != null && (
                  <span className="text-green-700 font-semibold shrink-0">
                    ₹{Number(p.amount_inr).toLocaleString('en-IN')}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
