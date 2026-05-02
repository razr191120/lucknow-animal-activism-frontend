import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Drives from './pages/Drives';
import DriveDetail from './pages/DriveDetail';
import NewDistribution from './pages/NewDistribution';
import RoutePlanner from './pages/RoutePlanner';
import Gallery from './pages/Gallery';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drives" element={<Drives />} />
          <Route path="/drives/:id" element={<DriveDetail />} />
          <Route path="/distribute" element={<NewDistribution />} />
          <Route path="/plan" element={<RoutePlanner />} />
          <Route path="/gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
