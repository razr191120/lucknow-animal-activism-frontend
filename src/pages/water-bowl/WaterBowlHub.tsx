import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/water-bowl/drives',
    icon: '🚗',
    title: 'Drives',
    desc: 'Create drives, add addresses, and track planned vs completed distribution runs.',
  },
  {
    to: '/water-bowl/plan',
    icon: '🗺️',
    title: 'Route planner',
    desc: 'Paste a list of addresses (plus your home as the first line). We geocode each to latitude/longitude, then compute an efficient visit order from your home through every stop.',
  },
  {
    to: '/water-bowl/distribute',
    icon: '📸',
    title: 'Record distribution',
    desc: 'At each stop: photos of the water bowl and caretaker/owner, name, contact, description, and GPS from your device (geolocation).',
  },
  {
    to: '/water-bowl/gallery',
    icon: '🖼️',
    title: 'Gallery',
    desc: 'Browse recent bowl and owner photos from recorded distributions.',
  },
];

export default function WaterBowlHub() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-900">
          Water Bowl Distribution
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-3xl">
          Plan a city-wide bowl drive: turn addresses into coordinates, optimize your route from
          home, then document each placement with photos and GPS. Nothing here was removed &mdash;
          it lives under this section.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group bg-white rounded-2xl border border-cyan-200 shadow-md p-6 hover:shadow-xl hover:border-cyan-400 transition-all"
          >
            <span className="text-4xl">{c.icon}</span>
            <h2 className="mt-3 text-xl font-bold text-cyan-800 group-hover:text-cyan-600">
              {c.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.desc}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-cyan-600">
              Open &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
