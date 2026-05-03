import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createLaapRescue } from '../../api/client';
import { LA } from './paths';

export default function RescueNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location_address, setLocationAddress] = useState('');
  const [contact_phone, setContactPhone] = useState('');
  const [animal_condition, setAnimalCondition] = useState('');
  const [urgency, setUrgency] = useState('high');
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
      fd.append('location_address', location_address);
      fd.append('urgency', urgency);
      if (description) fd.append('description', description);
      if (contact_phone) fd.append('contact_phone', contact_phone);
      if (animal_condition) fd.append('animal_condition', animal_condition);
      if (files) {
        Array.from(files)
          .slice(0, 5)
          .forEach((f, i) => fd.append(`image_${i}`, f));
      }
      const created = await createLaapRescue(fd);
      navigate(LA.rescue(created.id));
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
        setError('Could not create request.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-laap-950">Urgent rescue request</h1>
          <p className="text-sm text-earth-700">
            Clear address and photos help volunteers reach quickly.
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
              Location / address
            </label>
            <textarea
              required
              value={location_address}
              onChange={(e) => setLocationAddress(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Situation
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Animal condition
            </label>
            <input
              value={animal_condition}
              onChange={(e) => setAnimalCondition(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
              placeholder="Injured / stuck / newborn…"
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
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
            <Link
              to={LA.rescues}
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
