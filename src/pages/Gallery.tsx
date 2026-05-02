import { useEffect, useState } from 'react';
import { getDistributions } from '../api/client';
import type { Distribution } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Gallery() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Distribution | null>(null);

  useEffect(() => {
    getDistributions()
      .then(setDistributions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading gallery..." />;

  const photoDists = distributions.filter((d) => d.water_bowl_photo);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-water-900">Gallery</h1>
        <p className="text-gray-500 mt-1">
          Photos from our water bowl distributions across Lucknow
        </p>
      </div>

      {photoDists.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🖼️</span>
          <h3 className="text-xl font-semibold text-gray-600">
            No photos yet
          </h3>
          <p className="text-gray-400 mt-2">
            Record a distribution to add photos to the gallery
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photoDists.map((dist) => (
            <div
              key={dist.id}
              onClick={() => setSelected(dist)}
              className="group cursor-pointer relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dist.water_bowl_photo!}
                alt={`Water bowl by ${dist.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-medium text-sm truncate">{dist.name}</p>
                <p className="text-xs text-white/70 truncate">{dist.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.water_bowl_photo!}
                alt={`Water bowl by ${selected.name}`}
                className="w-full max-h-[60vh] object-contain bg-gray-100"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-water-800">
                {selected.name}
              </h3>
              <p className="text-gray-500 mt-1">{selected.address}</p>
              {selected.description && (
                <p className="text-gray-600 mt-3">{selected.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                {selected.contact && <span>📞 {selected.contact}</span>}
                <span>
                  📅{' '}
                  {new Date(selected.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {selected.owner_photo && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Volunteer Photo:</p>
                  <img
                    src={selected.owner_photo!}
                    alt="Volunteer"
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
