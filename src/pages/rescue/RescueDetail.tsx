import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getLaapRescue,
  updateLaapRescue,
  listRescueAssignments,
  assignVolunteerToRescue,
  addRescueFollowUpPhotos,
  listVolunteers,
} from '../../api/client';
import type { LaapRescue, RescueAssignment, Volunteer } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RescueDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const [rescue, setRescue] = useState<LaapRescue | null>(null);
  const [assignments, setAssignments] = useState<RescueAssignment[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVol, setSelectedVol] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [followUpFiles, setFollowUpFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    if (!id) return;
    const [r, a] = await Promise.all([
      getLaapRescue(id),
      listRescueAssignments(id),
    ]);
    setRescue(r);
    setAssignments(a);
    if (isAdmin) {
      const vols = await listVolunteers();
      setVolunteers(vols);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!id) return;
    const updated = await updateLaapRescue(id, { status: newStatus });
    setRescue(updated);
  }

  async function handleAssign() {
    if (!id || !selectedVol) return;
    setAssigning(true);
    await assignVolunteerToRescue(id, { volunteer_id: selectedVol });
    setSelectedVol('');
    const a = await listRescueAssignments(id);
    setAssignments(a);
    setAssigning(false);
  }

  async function handleFollowUp() {
    if (!id || followUpFiles.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    followUpFiles.forEach((f, i) => fd.append(`image_${i}`, f));
    const result = await addRescueFollowUpPhotos(id, fd);
    setRescue((prev) =>
      prev ? { ...prev, photo_urls: result.photo_urls } : prev,
    );
    setFollowUpFiles([]);
    setUploading(false);
  }

  if (loading) return <LoadingSpinner message="Loading rescue case..." />;
  if (!rescue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-gray-500">
        Rescue case not found.
      </div>
    );
  }

  const urgencyColor: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/rescue"
        className="text-red-600 hover:text-red-800 text-sm font-medium mb-6 inline-flex items-center gap-1"
      >
        &larr; Back to Rescue Cases
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyColor[rescue.urgency] ?? 'bg-gray-100 text-gray-700'}`}
          >
            {rescue.urgency}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
            {rescue.status.replace('_', ' ')}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{rescue.title}</h1>
        <p className="text-gray-500 mt-1">{rescue.location_address}</p>
        {rescue.description && (
          <p className="text-gray-700 mt-3 whitespace-pre-wrap">{rescue.description}</p>
        )}
        {rescue.animal_condition && (
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Condition:</span> {rescue.animal_condition}
          </p>
        )}
        {rescue.contact_phone && (
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Contact:</span> {rescue.contact_phone}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          Reported by {rescue.creator_full_name ?? 'Unknown'} &middot;{' '}
          {new Date(rescue.created_at).toLocaleString('en-IN')}
        </p>

        {isAdmin && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {['open', 'in_progress', 'resolved'].map((s) => (
              <button
                key={s}
                disabled={rescue.status === s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  rescue.status === s
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Photos */}
      {rescue.photo_urls.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Photos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rescue.photo_urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Rescue photo ${i + 1}`}
                className="rounded-lg object-cover h-48 w-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* Follow-up photos */}
      <div className="bg-white rounded-xl border border-gray-200 shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Add Follow-up Photos</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFollowUpFiles(Array.from(e.target.files ?? []).slice(0, 5))}
          className="mb-3"
        />
        <button
          onClick={handleFollowUp}
          disabled={uploading || followUpFiles.length === 0}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {/* Assignments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Volunteer Assignments ({assignments.length})
        </h2>
        {assignments.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {assignments.map((a) => (
              <li key={a.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {a.volunteer_name ?? 'Volunteer'}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Status: {a.status.replace('_', ' ')}
                  </p>
                  {a.notes && <p className="text-sm text-gray-400">{a.notes}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No volunteers assigned yet.</p>
        )}

        {isAdmin && volunteers.length > 0 && (
          <div className="mt-4 flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Volunteer
              </label>
              <select
                value={selectedVol}
                onChange={(e) => setSelectedVol(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm text-sm"
              >
                <option value="">Select volunteer...</option>
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.full_name ?? v.email ?? v.id}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssign}
              disabled={assigning || !selectedVol}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {assigning ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
