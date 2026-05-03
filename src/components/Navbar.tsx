import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LA } from '../pages/laap/paths';

function pathActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const waterLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/drives', label: 'Drives' },
    { to: '/distribute', label: 'New Distribution' },
    { to: '/plan', label: 'Route Planner' },
    { to: '/gallery', label: 'Gallery' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const laapLinks = [
    { to: LA.adoptions, label: 'Adoptions' },
    { to: LA.rescues, label: 'Rescues' },
    { to: LA.donations, label: 'Donations' },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-gradient-to-r from-water-700 via-water-600 to-leaf-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <span className="text-3xl drop-shadow-md" aria-hidden>
              💧
            </span>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:inline leading-tight">
              Lucknow Water Bowl
              <span className="block text-xs font-semibold text-white/80">
                &amp; L.A.A.P
              </span>
            </span>
            <span className="text-white font-bold text-lg tracking-tight sm:hidden">
              LWBP
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-wrap justify-end max-w-[calc(100%-11rem)]">
            {waterLinks.map((link) => {
              const active = pathActive(location.pathname, link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <span
              className="mx-1 h-6 w-px bg-white/25 shrink-0"
              aria-hidden
            />
            <span className="text-white/60 text-xs font-semibold uppercase tracking-wide px-1 shrink-0">
              L.A.A.P
            </span>
            {laapLinks.map((link) => {
              const active = pathActive(location.pathname, link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-orange-400/30 text-white shadow-inner ring-1 ring-white/20'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/20 shrink-0">
                <span className="text-white/70 text-sm hidden lg:inline max-w-[8rem] truncate">
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
        <div className="md:hidden bg-water-800/95 backdrop-blur-sm border-t border-white/10 max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <p className="text-white/50 text-xs font-semibold uppercase px-3 pt-1">
              Water bowls
            </p>
            {waterLinks.map((link) => {
              const active = pathActive(location.pathname, link.to);
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
            <p className="text-white/50 text-xs font-semibold uppercase px-3 pt-3">
              L.A.A.P
            </p>
            {laapLinks.map((link) => {
              const active = pathActive(location.pathname, link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-orange-400/25 text-white'
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
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
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
