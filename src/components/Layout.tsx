import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-emerald-900 text-white/60 text-center py-6 text-sm">
        <p>
          Lucknow Animal Activism Project (LAAP) &mdash; Rescue, Adopt,
          Volunteer, Donate &amp; Water Bowl Distribution
        </p>
        <p className="mt-1">Made with 🐾 and ❤️ in Lucknow, India</p>
      </footer>
    </div>
  );
}
