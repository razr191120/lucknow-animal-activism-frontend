import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getDistributions } from '../api/client';
import type { Stats, Distribution } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getStats(), getDistributions()])
      .then(([s, d]) => {
        setStats(s);
        setRecent(d.slice(0, 6));
      })
      .catch(() => setError('Could not connect to the backend.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-water-600 via-water-500 to-leaf-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-leaf-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="block">Water for Every</span>
            <span className="block mt-2 text-leaf-200">Street Animal</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Helping Lucknow's street animals stay hydrated, one water bowl at a
            time. Track distributions, plan routes, and make a difference.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/distribute"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-water-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-water-50 transition-all duration-200"
            >
              Record Distribution
            </Link>
            <Link
              to="/drives"
              className="inline-flex items-center justify-center px-8 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-200"
            >
              View Drives
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {loading ? (
          <LoadingSpinner message="Fetching stats..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
            {error}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="💧"
              label="Bowls Distributed"
              value={stats.total_distributions}
              color="water"
            />
            <StatCard
              icon="🚗"
              label="Total Drives"
              value={stats.total_drives}
              color="leaf"
            />
            <StatCard
              icon="✅"
              label="Drives Completed"
              value={stats.drives_completed}
              color="leaf"
            />
            <StatCard
              icon="📍"
              label="Unique Addresses"
              value={stats.unique_addresses}
              color="water"
            />
          </div>
        ) : null}
      </section>

      {/* Recent Distributions */}
      {recent.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-water-900 mb-8">
            Recent Distributions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((dist) => (
              <div
                key={dist.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-water-100"
              >
                {dist.water_bowl_photo && (
                  <img
                    src={`${API_URL}${dist.water_bowl_photo}`}
                    alt="Water bowl"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-water-800">{dist.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{dist.address}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(dist.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-water-900 mb-8">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            to="/distribute"
            icon="📸"
            title="Record Distribution"
            description="Capture a new water bowl placement"
          />
          <ActionCard
            to="/drives"
            icon="📋"
            title="Create Drive"
            description="Organize a new distribution drive"
          />
          <ActionCard
            to="/plan"
            icon="🗺️"
            title="Plan Route"
            description="Optimize your delivery route"
          />
          <ActionCard
            to="/gallery"
            icon="🖼️"
            title="View Gallery"
            description="Browse all distribution photos"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: 'water' | 'leaf';
}) {
  const bg = color === 'water' ? 'bg-water-50' : 'bg-leaf-50';
  const border = color === 'water' ? 'border-water-200' : 'border-leaf-200';
  const text = color === 'water' ? 'text-water-700' : 'text-leaf-700';

  return (
    <div
      className={`${bg} ${border} border rounded-xl p-6 shadow-md text-center`}
    >
      <span className="text-4xl">{icon}</span>
      <p className={`text-4xl font-extrabold ${text} mt-3`}>{value}</p>
      <p className="text-gray-600 font-medium mt-1">{label}</p>
    </div>
  );
}

function ActionCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-water-300 transition-all duration-200"
    >
      <span className="text-3xl block mb-3">{icon}</span>
      <h3 className="font-semibold text-water-800 group-hover:text-water-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}
