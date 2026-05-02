import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDrive, addAddresses } from '../api/client';
import type { Drive } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';
import MapView from '../components/MapView';

export default function DriveDetail() {
  const { id } = useParams<{ id: string }>();
  const [drive, setDrive] = useState<Drive | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAddresses, setNewAddresses] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) loadDrive(id);
  }, [id]);

  function loadDrive(driveId: string) {
    setLoading(true);
    getDrive(driveId)
      .then(setDrive)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleAddAddresses(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setAdding(true);
    try {
      const addresses = newAddresses
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean);
      await addAddresses(id, addresses);
      loadDrive(id);
      setNewAddresses('');
    } catch {
      alert('Failed to add addresses.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <LoadingSpinner message="Loading drive..." />;
  if (!drive)
    return (
      <div className="text-center py-20 text-gray-500">Drive not found.</div>
    );

  const addressMarkers = (drive.addresses || [])
    .filter((a) => a.latitude != null && a.longitude != null)
    .map((a, i) => ({
      position: [a.latitude!, a.longitude!] as [number, number],
      label: `${i + 1}`,
      popup: a.address,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/drives"
        className="text-water-600 hover:text-water-800 text-sm font-medium mb-6 inline-flex items-center gap-1"
      >
        ← Back to Drives
      </Link>

      <div className="bg-white rounded-xl border border-water-200 shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-water-600 to-leaf-500 p-8 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{drive.name}</h1>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              drive.status === 'completed'
                ? 'bg-white/20 text-white'
                : 'bg-white/20 text-white'
            }`}>
              {drive.status}
            </span>
          </div>
          {drive.description && (
            <p className="text-white/80 mt-2">{drive.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/70">
            <span>
              📅 Planned:{' '}
              {new Date(drive.planned_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>📍 {drive.addresses?.length || 0} addresses</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-water-800 mb-4">Addresses</h2>
          {drive.addresses && drive.addresses.length > 0 ? (
            <div className="space-y-2 mb-6">
              {drive.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-center gap-3 bg-water-50 text-water-700 px-4 py-2.5 rounded-lg text-sm border border-water-200"
                >
                  <span className="font-bold text-water-600">
                    {addr.order_index != null ? `${addr.order_index + 1}.` : '📍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{addr.address}</span>
                    {addr.latitude != null && (
                      <span className="text-xs text-gray-400">
                        {addr.latitude.toFixed(4)}, {addr.longitude?.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-6">No addresses yet.</p>
          )}

          <form onSubmit={handleAddAddresses} className="flex gap-3">
            <textarea
              value={newAddresses}
              onChange={(e) => setNewAddresses(e.target.value)}
              rows={2}
              placeholder="Add addresses, one per line..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none resize-none text-sm"
            />
            <button
              type="submit"
              disabled={adding || !newAddresses.trim()}
              className="px-6 py-2.5 bg-water-600 text-white font-semibold rounded-lg hover:bg-water-700 disabled:opacity-50 transition-all self-end"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      </div>

      {addressMarkers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-water-800 mb-4">
            Addresses Map
          </h2>
          <MapView
            markers={addressMarkers}
            center={addressMarkers[0]?.position}
            zoom={13}
          />
        </div>
      )}

      <div className="text-center py-12">
        <Link
          to="/distribute"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-water-600 to-leaf-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          📸 Record a Distribution for this Drive
        </Link>
      </div>
    </div>
  );
}
