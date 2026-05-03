import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createLaapDonation } from '../../api/client';

/**
 * Public flow: create a donation *request* (case + photos + how to help).
 * Supporters respond via UPI/bank/etc. and can log a pledge on the campaign page.
 */
export default function RequestDonation() {
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
      if (items_or_need_summary) fd.append('items_or_need_summary', items_or_need_summary);
      if (how_to_donate) fd.append('how_to_donate', how_to_donate);
      if (contact_phone) fd.append('contact_phone', contact_phone);
      if (upi_id) fd.append('upi_id', upi_id);
      if (bank_account_hint) fd.append('bank_account_hint', bank_account_hint);
      if (target_amount_inr.trim()) fd.append('target_amount_inr', target_amount_inr.trim());
      if (files) {
        Array.from(files)
          .slice(0, 5)
          .forEach((f, i) => fd.append(`image_${i}`, f));
      }
      const created = await createLaapDonation(fd);
      navigate(`/donate/campaigns/${created.id}`);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { detail?: string | { msg: string }[] } } };
      const d = ax.response?.data?.detail;
      if (Array.isArray(d)) setError(d.map((x) => x.msg).join(' '));
      else if (typeof d === 'string') setError(d);
      else setError('Could not publish donation request.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request a donation</h1>
          <p className="text-gray-500 mt-1">
            Describe the case, what is needed, how others can help, and attach photos. This is not
            a direct donation form &mdash; other users give through your instructions and can log a
            pledge on your campaign page.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link to="/donate/campaigns" className="text-green-600 hover:text-green-800 font-medium">
            Browse requests
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/donate/record" className="text-green-600 hover:text-green-800 font-medium">
            Admin: record receipt
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case details &mdash; what is needed
          </label>
          <textarea
            value={items_or_need_summary}
            onChange={(e) => setItems(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
            placeholder="e.g. vet bills, 20 kg food, transport — be specific"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full story / context for donors
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How others can donate (UPI, bank, drop-off, in-kind)
          </label>
          <textarea
            value={how_to_donate}
            onChange={(e) => setHow(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
            placeholder="Clear steps so supporters know exactly what to do"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal (₹, optional)</label>
            <input
              value={target_amount_inr}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact phone</label>
            <input
              value={contact_phone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (optional)</label>
          <input
            value={upi_id}
            onChange={(e) => setUpi(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank hint (optional — never paste full account numbers)
          </label>
          <input
            value={bank_account_hint}
            onChange={(e) => setBank(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="e.g. SBI savings · last 4 digits only"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos of the case / animals / bills (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 shadow-md"
        >
          {submitting ? 'Publishing…' : 'Publish donation request'}
        </button>
      </form>
    </div>
  );
}
