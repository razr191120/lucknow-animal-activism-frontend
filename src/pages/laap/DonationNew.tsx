import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createLaapDonation } from '../../api/client';
import { LA } from './paths';

export default function DonationNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items_or_need_summary, setItems] = useState('');
  const [how_to_donate, setHow] = useState('');
  const [contact_phone, setContactPhone] = useState('');
  const [upi_id, setUpi] = useState('');
  const [bank_account_hint, setBank] = useState('');
  const [target_amount_inr, setTarget] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      if (description) fd.append('description', description);
      if (items_or_need_summary) {
        fd.append('items_or_need_summary', items_or_need_summary);
      }
      if (how_to_donate) fd.append('how_to_donate', how_to_donate);
      if (contact_phone) fd.append('contact_phone', contact_phone);
      if (upi_id) fd.append('upi_id', upi_id);
      if (bank_account_hint) fd.append('bank_account_hint', bank_account_hint);
      if (target_amount_inr.trim()) {
        fd.append('target_amount_inr', target_amount_inr.trim());
      }
      if (files) {
        Array.from(files)
          .slice(0, 5)
          .forEach((f, i) => fd.append(`image_${i}`, f));
      }
      const created = await createLaapDonation(fd);
      navigate(LA.donation(created.id));
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { detail?: string | { msg: string }[] } };
      };
      const d = ax.response?.data?.detail;
      if (Array.isArray(d)) {
        setError(d.map((x) => x.msg).join(' '));
      } else if (typeof d === 'string') {
        setError(d);
      } else {
        setError('Could not create appeal.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-laap-950">Donation appeal</h1>
          <p className="text-sm text-earth-700">
            Explain what is needed and how donors can help (UPI, drop-off, in-kind).
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-laap-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              What is needed
            </label>
            <textarea
              value={items_or_need_summary}
              onChange={(e) => setItems(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
              placeholder="e.g. 20 kg dog food, antibiotics, transport to vet"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Story / context
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              How to donate
            </label>
            <textarea
              value={how_to_donate}
              onChange={(e) => setHow(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
              placeholder="Steps: UPI / bank / drop-off address / WhatsApp coordination"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Optional goal (₹)
            </label>
            <input
              value={target_amount_inr}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              UPI ID (optional)
            </label>
            <input
              value={upi_id}
              onChange={(e) => setUpi(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Bank hint (optional — do not paste full account number)
            </label>
            <input
              value={bank_account_hint}
              onChange={(e) => setBank(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
              placeholder="e.g. SBI · savings · last 4 digits only"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Contact phone
            </label>
            <input
              value={contact_phone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Photos (max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-laap-600 px-5 py-2.5 font-bold text-white hover:bg-laap-700 disabled:opacity-50"
            >
              {submitting ? 'Publishing…' : 'Publish'}
            </button>
            <Link
              to={LA.donations}
              className="rounded-xl border border-laap-300 px-5 py-2.5 font-medium text-laap-900 hover:bg-laap-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
