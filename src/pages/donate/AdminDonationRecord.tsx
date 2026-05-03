import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { recordDonation, listLaapDonations } from '../../api/client';
import type { LaapDonation } from '../../api/types';
import { useAuth } from '../../context/AuthContext';

/** Admin / treasurer: log an offline receipt against a campaign (optional). */
export default function AdminDonationRecord() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [campaigns, setCampaigns] = useState<LaapDonation[]>([]);
  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount_inr: '',
    purpose: '',
    payment_mode: 'cash',
    campaign_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (isAdmin) {
      listLaapDonations('open').then(setCampaigns).catch(() => {});
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/donate" replace />;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await recordDonation({
        donor_name: form.donor_name,
        donor_email: form.donor_email || undefined,
        donor_phone: form.donor_phone || undefined,
        amount_inr: parseFloat(form.amount_inr),
        purpose: form.purpose || undefined,
        payment_mode: form.payment_mode,
        campaign_id: form.campaign_id || undefined,
        date: form.date,
        notes: form.notes || undefined,
      });
      setSuccess(`Recorded. Receipt: ${result.receipt_number}`);
      setForm({
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        amount_inr: '',
        purpose: '',
        payment_mode: 'cash',
        campaign_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { detail?: string } } };
      setError(ax.response?.data?.detail ?? 'Failed to record donation.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Record donation (admin)</h1>
          <p className="text-gray-500 mt-1">
            For treasurer use: log a received amount and receipt number. Public donors use
            donation requests and pledges instead.
          </p>
        </div>
        <Link to="/donate" className="text-sm text-green-600 font-medium">
          &larr; Donate home
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donor name *</label>
            <input
              name="donor_name"
              value={form.donor_name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR) *</label>
            <input
              name="amount_inr"
              type="number"
              min="1"
              step="0.01"
              value={form.amount_inr}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="donor_email" type="email" value={form.donor_email} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="donor_phone" value={form.donor_phone} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment mode</label>
            <select name="payment_mode" value={form.payment_mode} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm">
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <input name="purpose" value={form.purpose} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm" />
        </div>
        {campaigns.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link to campaign (optional)</label>
            <select name="campaign_id" value={form.campaign_id} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm">
              <option value="">None</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full rounded-lg border-gray-300 shadow-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 disabled:opacity-50">
          {loading ? 'Saving…' : 'Save receipt record'}
        </button>
      </form>
    </div>
  );
}
