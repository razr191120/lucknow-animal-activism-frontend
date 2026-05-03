import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLaapDonation } from '../../api/client';
import type { LaapDonation } from '../../api/types';
import { LA } from './paths';

export default function DonationDetail() {
  const { id } = useParams<{ id: string }>();
  const [row, setRow] = useState<LaapDonation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getLaapDonation(id)
      .then(setRow)
      .catch(() => setError('Not found.'));
  }, [id]);

  if (error || !id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-red-700">
        {error || 'Invalid link.'}{' '}
        <Link to={LA.donations} className="underline">
          Back
        </Link>
      </div>
    );
  }
  if (!row) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-earth-700">Loading…</div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to={LA.donations}
        className="text-sm font-medium text-laap-700 hover:underline"
      >
        ← All appeals
      </Link>
      <header>
        <h1 className="text-2xl font-black text-laap-950">{row.title}</h1>
        <p className="mt-2 text-sm text-earth-700">
          Posted by {row.creator_full_name || 'Member'} · {row.status}
        </p>
        {row.target_amount_inr && (
          <p className="mt-1 text-sm font-semibold text-laap-800">
            Goal: ₹{row.target_amount_inr}
          </p>
        )}
      </header>
      {row.photo_urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {row.photo_urls.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              className="h-40 w-40 rounded-lg object-cover"
            />
          ))}
        </div>
      )}
      <section className="space-y-4 rounded-xl border border-laap-200 bg-white p-5 shadow-sm">
        {row.items_or_need_summary && (
          <div>
            <h2 className="font-bold text-laap-900">What is needed</h2>
            <p className="mt-2 whitespace-pre-wrap text-earth-800">
              {row.items_or_need_summary}
            </p>
          </div>
        )}
        {row.description && (
          <div>
            <h2 className="font-bold text-laap-900">Details</h2>
            <p className="mt-2 whitespace-pre-wrap text-earth-800">{row.description}</p>
          </div>
        )}
        {row.how_to_donate && (
          <div>
            <h2 className="font-bold text-laap-900">How to donate</h2>
            <p className="mt-2 whitespace-pre-wrap text-earth-800">{row.how_to_donate}</p>
          </div>
        )}
        {row.upi_id && (
          <p className="text-sm text-earth-700">
            <span className="font-semibold">UPI:</span>{' '}
            <span className="font-mono">{row.upi_id}</span>
          </p>
        )}
        {row.bank_account_hint && (
          <p className="text-sm text-earth-700">
            <span className="font-semibold">Bank:</span> {row.bank_account_hint}
          </p>
        )}
        {row.contact_phone && (
          <p className="text-sm text-earth-700">
            <span className="font-semibold">Phone:</span>{' '}
            <a href={`tel:${row.contact_phone}`} className="text-laap-700 underline">
              {row.contact_phone}
            </a>
          </p>
        )}
      </section>
    </article>
  );
}
