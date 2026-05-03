import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDistribution, getDrives } from '../api/client';
import type { Drive } from '../api/types';

export default function NewDistribution() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    description: '',
    latitude: '',
    longitude: '',
    address: '',
    drive_id: '',
  });
  const [bowlPhoto, setBowlPhoto] = useState<File | null>(null);
  const [ownerPhoto, setOwnerPhoto] = useState<File | null>(null);
  const [bowlPreview, setBowlPreview] = useState('');
  const [ownerPreview, setOwnerPreview] = useState('');
  const bowlInputRef = useRef<HTMLInputElement>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDrives().then(setDrives).catch(() => {});
    detectLocation();
  }, []);

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true },
    );
  }

  function handleFileChange(
    file: File | null,
    setFile: (f: File | null) => void,
    setPreview: (s: string) => void,
  ) {
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bowlPhoto) {
      alert('Please take/select a water bowl photo.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('contact', form.contact);
      fd.append('description', form.description);
      fd.append('latitude', form.latitude);
      fd.append('longitude', form.longitude);
      fd.append('address', form.address);
      if (form.drive_id) fd.append('drive_id', form.drive_id);
      fd.append('water_bowl_photo', bowlPhoto);
      if (ownerPhoto) fd.append('owner_photo', ownerPhoto);

      await createDistribution(fd);
      navigate('/water-bowl');
    } catch {
      alert('Failed to record distribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-water-900">
          Record Distribution
        </h1>
        <p className="text-gray-500 mt-1">
          Capture details of a water bowl placement
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-water-200 shadow-lg p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PhotoInput
            label="Water Bowl Photo *"
            preview={bowlPreview}
            inputRef={bowlInputRef}
            onChange={(f) => handleFileChange(f, setBowlPhoto, setBowlPreview)}
          />
          <PhotoInput
            label="Owner/Volunteer Photo"
            preview={ownerPreview}
            inputRef={ownerInputRef}
            onChange={(f) =>
              handleFileChange(f, setOwnerPhoto, setOwnerPreview)
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
              placeholder="Phone or email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow resize-none"
            placeholder="Any notes about this placement..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="text-xs text-water-600 hover:text-water-800 font-medium"
            >
              {locating ? 'Detecting...' : 'Detect GPS'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow text-sm"
              placeholder="Latitude"
            />
            <input
              type="text"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow text-sm"
              placeholder="Longitude"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
            placeholder="e.g., Near Hazratganj crossing, Lucknow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drive (optional)
          </label>
          <select
            value={form.drive_id}
            onChange={(e) => setForm({ ...form, drive_id: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow bg-white"
          >
            <option value="">-- Not part of a drive --</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-water-600 to-leaf-500 text-white font-bold rounded-xl hover:from-water-700 hover:to-leaf-600 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
        >
          {submitting ? 'Submitting...' : 'Record Distribution'}
        </button>
      </form>
    </div>
  );
}

function PhotoInput({
  label,
  preview,
  inputRef,
  onChange,
}: {
  label: string;
  preview: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:border-water-400 hover:bg-water-50/50 transition-all group overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
              📷
            </span>
            <span className="text-sm text-gray-400">
              Tap to take photo or select file
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );
}
