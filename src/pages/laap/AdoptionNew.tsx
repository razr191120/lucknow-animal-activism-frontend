import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createLaapAdoption } from '../../api/client';
import { LA } from './paths';

export default function AdoptionNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [animal_name, setAnimalName] = useState('');
  const [description, setDescription] = useState('');
  const [contact_phone, setContactPhone] = useState('');
  const [location_hint, setLocationHint] = useState('');
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
      if (animal_name) fd.append('animal_name', animal_name);
      if (description) fd.append('description', description);
      if (contact_phone) fd.append('contact_phone', contact_phone);
      if (location_hint) fd.append('location_hint', location_hint);
      if (files) {
        Array.from(files)
          .slice(0, 5)
          .forEach((f, i) => fd.append(`image_${i}`, f));
      }
      const created = await createLaapAdoption(fd);
      navigate(LA.adoption(created.id));
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
        setError('Could not create listing.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-laap-950">New adoption request</h1>
          <p className="text-sm text-earth-700">
            Up to 5 images — same attachments storage as water bowl drives.
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
              Animal name
            </label>
            <input
              value={animal_name}
              onChange={(e) => setAnimalName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-laap-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-800">
              Description
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
              Location / area hint
            </label>
            <input
              value={location_hint}
              onChange={(e) => setLocationHint(e.target.value)}
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
              to={LA.adoptions}
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
