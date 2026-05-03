import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getLaapAdoption,
  applyToAdopt,
  listAdoptionApplications,
  reviewApplication,
} from '../../api/client';
import type { LaapAdoption, AdoptionApplication } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdoptDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const [listing, setListing] = useState<LaapAdoption | null>(null);
  const [apps, setApps] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyForm, setApplyForm] = useState({
    applicant_name: user?.full_name ?? '',
    applicant_phone: '',
    applicant_address: '',
    why_adopt: '',
    has_experience: false,
    living_situation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');

  async function load() {
    if (!id) return;
    const [l, a] = await Promise.all([
      getLaapAdoption(id),
      listAdoptionApplications(id).catch(() => [] as AdoptionApplication[]),
    ]);
    setListing(l);
    setApps(a);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setApplyError('');
    try {
      await applyToAdopt(id, applyForm);
      setShowApplyForm(false);
      const a = await listAdoptionApplications(id);
      setApps(a);
    } catch (err: any) {
      setApplyError(err.response?.data?.detail ?? 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReview(appId: string, status: string) {
    await reviewApplication(appId, { status });
    if (id) {
      const a = await listAdoptionApplications(id);
      setApps(a);
    }
  }

  if (loading) return <LoadingSpinner message="Loading listing..." />;
  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-gray-500">
        Listing not found.
      </div>
    );
  }

  const alreadyApplied = apps.some((a) => a.applicant_id === user?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/adopt"
        className="text-amber-600 hover:text-amber-800 text-sm font-medium mb-6 inline-flex items-center gap-1"
      >
        &larr; Back to Listings
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-6">
        {listing.photo_urls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {listing.photo_urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Photo ${i + 1}`}
                className="w-full h-56 object-cover"
              />
            ))}
          </div>
        )}
        <div className="p-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${listing.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
          >
            {listing.status}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            {listing.animal_name ?? listing.title}
          </h1>
          {listing.animal_name && (
            <p className="text-gray-500 mt-1">{listing.title}</p>
          )}
          {listing.description && (
            <p className="text-gray-700 mt-3 whitespace-pre-wrap">
              {listing.description}
            </p>
          )}
          {listing.location_hint && (
            <p className="text-sm text-gray-600 mt-2">Location: {listing.location_hint}</p>
          )}
          {listing.contact_phone && (
            <p className="text-sm text-gray-600 mt-1">Contact: {listing.contact_phone}</p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Posted by {listing.creator_full_name ?? 'Unknown'} &middot;{' '}
            {new Date(listing.created_at).toLocaleDateString('en-IN')}
          </p>

          {listing.status === 'open' && !alreadyApplied && !showApplyForm && (
            <button
              onClick={() => setShowApplyForm(true)}
              className="mt-5 px-6 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md"
            >
              Apply to Adopt
            </button>
          )}
          {alreadyApplied && (
            <p className="mt-4 text-sm text-green-600 font-medium">
              You have already applied for this animal.
            </p>
          )}
        </div>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Adoption Application</h2>
          {applyError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {applyError}
            </div>
          )}
          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  value={applyForm.applicant_name}
                  onChange={(e) => setApplyForm({ ...applyForm, applicant_name: e.target.value })}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={applyForm.applicant_phone}
                  onChange={(e) => setApplyForm({ ...applyForm, applicant_phone: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                value={applyForm.applicant_address}
                onChange={(e) => setApplyForm({ ...applyForm, applicant_address: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to adopt?
              </label>
              <textarea
                value={applyForm.why_adopt}
                onChange={(e) => setApplyForm({ ...applyForm, why_adopt: e.target.value })}
                rows={3}
                className="w-full rounded-lg border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Living Situation</label>
              <input
                value={applyForm.living_situation}
                onChange={(e) => setApplyForm({ ...applyForm, living_situation: e.target.value })}
                placeholder="e.g. Apartment with balcony, house with yard"
                className="w-full rounded-lg border-gray-300 shadow-sm"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={applyForm.has_experience}
                onChange={(e) => setApplyForm({ ...applyForm, has_experience: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">I have experience caring for animals</span>
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applications (visible to listing owner / admin) */}
      {(isAdmin || listing.user_id === user?.id) && apps.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Applications ({apps.length})
          </h2>
          <ul className="divide-y divide-gray-100">
            {apps.map((a) => (
              <li key={a.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{a.applicant_name}</p>
                    {a.applicant_phone && (
                      <p className="text-sm text-gray-500">{a.applicant_phone}</p>
                    )}
                    {a.why_adopt && (
                      <p className="text-sm text-gray-600 mt-1">{a.why_adopt}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      Status: {a.status} &middot;{' '}
                      {new Date(a.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  {isAdmin && a.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(a.id, 'approved')}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(a.id, 'rejected')}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
