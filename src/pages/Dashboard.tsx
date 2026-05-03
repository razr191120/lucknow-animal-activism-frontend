import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../api/client';
import type { Stats } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError('Could not connect to the backend.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="block">Lucknow Animal</span>
            <span className="block mt-2 text-emerald-200">Activism Project</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Rescue, adopt, volunteer, donate, and distribute water bowls &mdash;
            all in one platform for Lucknow&rsquo;s street animals.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              to="/rescue/report"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all"
            >
              Report Rescue
            </Link>
            <Link
              to="/water-bowl/distribute"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all"
            >
              Record Distribution
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all"
            >
              Record Donation
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {loading ? (
          <LoadingSpinner message="Fetching stats..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
            {error}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon="💧" label="Bowls Distributed" value={stats.total_distributions} accent="bg-cyan-50 border-cyan-200 text-cyan-700" />
            <StatCard icon="🚨" label="Active Rescues" value={stats.open_rescues} accent="bg-red-50 border-red-200 text-red-700" />
            <StatCard icon="🏠" label="Up for Adoption" value={stats.open_adoptions} accent="bg-amber-50 border-amber-200 text-amber-700" />
            <StatCard icon="💰" label="Donations (INR)" value={stats.total_donations_inr} prefix="₹" accent="bg-green-50 border-green-200 text-green-700" />
            <StatCard icon="🙋" label="Active Volunteers" value={stats.active_volunteers} accent="bg-purple-50 border-purple-200 text-purple-700" />
            <StatCard icon="🚗" label="Total Drives" value={stats.total_drives} accent="bg-blue-50 border-blue-200 text-blue-700" />
          </div>
        ) : null}
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard to="/water-bowl/distribute" icon="💧" title="Record Distribution" description="Capture a new water bowl placement" />
          <ActionCard to="/rescue/report" icon="🚨" title="Report Rescue" description="Report an animal that needs help" />
          <ActionCard to="/adopt/post" icon="🏠" title="Post for Adoption" description="List an animal for adoption" />
          <ActionCard to="/donate" icon="💰" title="Record Donation" description="Log a monetary donation" />
          <ActionCard to="/volunteer" icon="🙋" title="Join as Volunteer" description="Sign up and start helping" />
          <ActionCard to="/water-bowl/plan" icon="🗺️" title="Plan Route" description="Optimize your delivery route" />
        </div>
      </section>

      {/* Section Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <SectionLink to="/water-bowl" icon="💧" title="Water Bowl" subtitle="Drive management & distributions" accent="from-cyan-500 to-blue-500" />
          <SectionLink to="/rescue" icon="🚨" title="Rescue" subtitle="Report & track rescue cases" accent="from-red-500 to-pink-500" />
          <SectionLink to="/adopt" icon="🏠" title="Adopt" subtitle="Find or list animals for adoption" accent="from-amber-500 to-orange-500" />
          <SectionLink to="/donate" icon="💰" title="Donate" subtitle="Record & track donations" accent="from-green-500 to-emerald-500" />
          <SectionLink to="/volunteer" icon="🙋" title="Volunteer" subtitle="Sign up, log hours & compete" accent="from-purple-500 to-indigo-500" />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  prefix,
}: {
  icon: string;
  label: string;
  value: number;
  accent: string;
  prefix?: string;
}) {
  const formatted =
    prefix === '₹'
      ? `₹${value.toLocaleString('en-IN')}`
      : value.toLocaleString('en-IN');

  return (
    <div className={`border rounded-xl p-5 shadow-md text-center ${accent}`}>
      <span className="text-3xl">{icon}</span>
      <p className="text-3xl font-extrabold mt-2">{formatted}</p>
      <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
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
      className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-200"
    >
      <span className="text-3xl block mb-3">{icon}</span>
      <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}

function SectionLink({
  to,
  icon,
  title,
  subtitle,
  accent,
}: {
  to: string;
  icon: string;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative bg-gradient-to-br ${accent} rounded-xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
    >
      <span className="text-4xl block mb-2">{icon}</span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-white/80 mt-1">{subtitle}</p>
    </Link>
  );
}
