import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 via-white to-leaf-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-water-900 text-white/60 text-center py-6 text-sm">
        <p>
          Lucknow Water Bowl Drive &mdash; Providing water for street animals
        </p>
        <p className="mt-1">Made with 💧 and ❤️ in Lucknow, India</p>
      </footer>
    </div>
  );
}
