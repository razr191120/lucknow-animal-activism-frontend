import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import LoadingSpinner from './components/LoadingSpinner';

// Water Bowl
import Drives from './pages/Drives';
import DriveDetail from './pages/DriveDetail';
import NewDistribution from './pages/NewDistribution';
import RoutePlanner from './pages/RoutePlanner';
import Gallery from './pages/Gallery';

// Rescue
import RescueList from './pages/rescue/RescueList';
import ReportRescue from './pages/rescue/ReportRescue';
import RescueDetail from './pages/rescue/RescueDetail';

// Adopt
import AdoptList from './pages/adopt/AdoptList';
import PostAdoption from './pages/adopt/PostAdoption';
import AdoptDetail from './pages/adopt/AdoptDetail';
import MyApplications from './pages/adopt/MyApplications';

// Donate
import DonateForm from './pages/donate/DonateForm';
import DonationHistory from './pages/donate/DonationHistory';
import Campaigns from './pages/donate/Campaigns';

// Volunteer
import VolunteerSignup from './pages/volunteer/VolunteerSignup';
import MyAssignments from './pages/volunteer/MyAssignments';
import ActivityLog from './pages/volunteer/ActivityLog';
import Leaderboard from './pages/volunteer/Leaderboard';

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
            <Route path="/admin" element={<Admin />} />

            {/* Water Bowl */}
            <Route path="/water-bowl" element={<Drives />} />
            <Route path="/water-bowl/drives/:id" element={<DriveDetail />} />
            <Route path="/water-bowl/distribute" element={<NewDistribution />} />
            <Route path="/water-bowl/plan" element={<RoutePlanner />} />
            <Route path="/water-bowl/gallery" element={<Gallery />} />

            {/* Rescue */}
            <Route path="/rescue" element={<RescueList />} />
            <Route path="/rescue/report" element={<ReportRescue />} />
            <Route path="/rescue/:id" element={<RescueDetail />} />

            {/* Adopt */}
            <Route path="/adopt" element={<AdoptList />} />
            <Route path="/adopt/post" element={<PostAdoption />} />
            <Route path="/adopt/applications" element={<MyApplications />} />
            <Route path="/adopt/:id" element={<AdoptDetail />} />

            {/* Donate */}
            <Route path="/donate" element={<DonateForm />} />
            <Route path="/donate/history" element={<DonationHistory />} />
            <Route path="/donate/campaigns" element={<Campaigns />} />

            {/* Volunteer */}
            <Route path="/volunteer" element={<VolunteerSignup />} />
            <Route path="/volunteer/assignments" element={<MyAssignments />} />
            <Route path="/volunteer/activity" element={<ActivityLog />} />
            <Route path="/volunteer/leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
