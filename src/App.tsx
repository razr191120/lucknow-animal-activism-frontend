import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Drives from './pages/Drives';
import DriveDetail from './pages/DriveDetail';
import NewDistribution from './pages/NewDistribution';
import RoutePlanner from './pages/RoutePlanner';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import LoadingSpinner from './components/LoadingSpinner';
import AdoptionList from './pages/laap/AdoptionList';
import AdoptionNew from './pages/laap/AdoptionNew';
import AdoptionDetail from './pages/laap/AdoptionDetail';
import RescueList from './pages/laap/RescueList';
import RescueNew from './pages/laap/RescueNew';
import RescueDetail from './pages/laap/RescueDetail';
import DonationList from './pages/laap/DonationList';
import DonationNew from './pages/laap/DonationNew';
import DonationDetail from './pages/laap/DonationDetail';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Loading..." />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/drives" element={<Drives />} />
            <Route path="/drives/:id" element={<DriveDetail />} />
            <Route path="/distribute" element={<NewDistribution />} />
            <Route path="/plan" element={<RoutePlanner />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/laap/adoptions" element={<AdoptionList />} />
            <Route path="/laap/adoptions/new" element={<AdoptionNew />} />
            <Route path="/laap/adoptions/:id" element={<AdoptionDetail />} />
            <Route path="/laap/rescues" element={<RescueList />} />
            <Route path="/laap/rescues/new" element={<RescueNew />} />
            <Route path="/laap/rescues/:id" element={<RescueDetail />} />
            <Route path="/laap/donations" element={<DonationList />} />
            <Route path="/laap/donations/new" element={<DonationNew />} />
            <Route path="/laap/donations/:id" element={<DonationDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
