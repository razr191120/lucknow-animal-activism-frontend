import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/drives', label: 'Drives' },
    { to: '/distribute', label: 'New Distribution' },
    { to: '/plan', label: 'Route Planner' },
    { to: '/gallery', label: 'Gallery' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-gradient-to-r from-water-700 via-water-600 to-leaf-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-3xl drop-shadow-md" aria-hidden>
              💧
            </span>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:inline">
              Lucknow Water Bowl Drive
            </span>
            <span className="text-white font-bold text-lg tracking-tight sm:hidden">
              LWBD
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                <span className="text-white/70 text-sm hidden lg:inline">
                  {user.full_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-white/10 text-white/90 text-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-water-800/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <div className="pt-2 mt-2 border-t border-white/10">
                <p className="text-white/60 text-sm px-3 py-1">
                  {user.full_name} ({user.role})
                </p>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
