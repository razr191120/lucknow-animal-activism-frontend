import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLaapAdoption } from '../../api/client';
import type { LaapAdoption } from '../../api/types';
import { LA } from './paths';

export default function AdoptionDetail() {
  const { id } = useParams<{ id: string }>();
  const [row, setRow] = useState<LaapAdoption | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getLaapAdoption(id)
      .then(setRow)
      .catch(() => setError('Not found.'));
  }, [id]);

  if (error || !id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-red-700">
        {error || 'Invalid link.'}{' '}
        <Link to={LA.adoptions} className="underline">
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
        to={LA.adoptions}
        className="text-sm font-medium text-laap-700 hover:underline"
      >
        ← All adoptions
      </Link>
      <header>
        <h1 className="text-2xl font-black text-laap-950">{row.title}</h1>
        {row.animal_name && (
          <p className="text-lg text-earth-700">{row.animal_name}</p>
        )}
        <p className="mt-2 text-sm text-earth-700">
          Posted by {row.creator_full_name || 'Member'} · Status: {row.status}
        </p>
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
      <section className="rounded-xl border border-laap-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-laap-900">About</h2>
        <p className="mt-2 whitespace-pre-wrap text-earth-800">
          {row.description || '—'}
        </p>
        {row.location_hint && (
          <p className="mt-3 text-sm text-earth-700">
            <span className="font-semibold">Area:</span> {row.location_hint}
          </p>
        )}
        {row.contact_phone && (
          <p className="mt-1 text-sm text-earth-700">
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
