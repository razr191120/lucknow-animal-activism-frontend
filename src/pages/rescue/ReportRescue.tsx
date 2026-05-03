import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLaapRescue } from '../../api/client';

export default function ReportRescue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    location_address: '',
    contact_phone: '',
    animal_condition: '',
    urgency: 'high',
  });
  const [files, setFiles] = useState<File[]>([]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('location_address', form.location_address);
      fd.append('urgency', form.urgency);
      if (form.description) fd.append('description', form.description);
      if (form.contact_phone) fd.append('contact_phone', form.contact_phone);
      if (form.animal_condition) fd.append('animal_condition', form.animal_condition);
      files.forEach((f, i) => fd.append(`image_${i}`, f));
      await createLaapRescue(fd);
      navigate('/rescue');
    } catch {
      setError('Failed to report rescue case.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Rescue Case</h1>
      <p className="text-gray-500 mb-8">Provide details about the animal that needs help</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address *</label>
          <input
            name="location_address"
            value={form.location_address}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              name="contact_phone"
              value={form.contact_phone}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Animal Condition</label>
          <input
            name="animal_condition"
            value={form.animal_condition}
            onChange={handleChange}
            placeholder="e.g. Injured leg, dehydrated"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos (up to 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
            className="w-full"
          />
          {files.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">{files.length} file(s) selected</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-md"
        >
          {loading ? 'Submitting...' : 'Report Rescue Case'}
        </button>
      </form>
    </div>
  );
}
