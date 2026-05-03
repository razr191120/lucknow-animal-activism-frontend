import { useState } from 'react';
import { geocodeAddresses, optimizeRoute } from '../api/client';
import type { GeocodedAddress, OptimizedRoute } from '../api/types';
import MapView from '../components/MapView';

export default function RoutePlanner() {
  const [addressText, setAddressText] = useState('');
  const [startAddress, setStartAddress] = useState('');
  const [geocoded, setGeocoded] = useState<GeocodedAddress[]>([]);
  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState('');

  async function handleGeocode() {
    setError('');
    const allAddresses = [
      startAddress.trim(),
      ...addressText
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
    ].filter(Boolean);

    if (allAddresses.length < 2) {
      setError('Enter a start address and at least one destination.');
      return;
    }

    setGeocoding(true);
    try {
      const results = await geocodeAddresses(allAddresses);
      setGeocoded(results);
      setRoute(null);
    } catch {
      setError('Failed to geocode addresses. Check your backend connection.');
    } finally {
      setGeocoding(false);
    }
  }

  async function handleOptimize() {
    const successful = geocoded.filter((g) => g.success && g.latitude != null);
    if (successful.length < 2) return;
    setError('');
    setOptimizing(true);
    try {
      const start = {
        latitude: successful[0].latitude!,
        longitude: successful[0].longitude!,
        label: successful[0].address,
      };
      const destinations = successful.slice(1).map((g) => ({
        latitude: g.latitude!,
        longitude: g.longitude!,
        label: g.address,
      }));
      const result = await optimizeRoute(start, destinations);
      setRoute(result);
    } catch {
      setError('Failed to optimize route.');
    } finally {
      setOptimizing(false);
    }
  }

  const successful = geocoded.filter((g) => g.success && g.latitude != null);

  const markers = successful.map((g, i) => ({
    position: [g.latitude!, g.longitude!] as [number, number],
    label: `${i + 1}`,
    popup: `${i === 0 ? 'START: ' : `${i}. `}${g.display_name || g.address}`,
  }));

  const routePositions = route
    ? [
        ...(successful.length > 0
          ? [[successful[0].latitude!, successful[0].longitude!] as [number, number]]
          : []),
        ...route.ordered_stops.map(
          (s) => [s.latitude, s.longitude] as [number, number],
        ),
      ]
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-gray-600 mb-6 max-w-3xl">
        Enter your <strong>home address as the first line</strong>, then one address per line for
        every stop. We geocode each line to latitude/longitude (OpenStreetMap Nominatim), then you
        can build the <strong>shortest practical visit order</strong> from home through all stops
        using our route optimizer.
      </p>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-water-900">Route Planner</h1>
        <p className="text-gray-500 mt-1">
          Plan the most efficient route for your water bowl distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-water-200 shadow-lg p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Address (your home)
              </label>
              <input
                type="text"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow"
                placeholder="e.g., Hazratganj, Lucknow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destinations (one per line)
              </label>
              <textarea
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-400 focus:border-water-400 outline-none transition-shadow resize-none font-mono text-sm"
                placeholder={"Gomti Nagar, Lucknow\nAliganj, Lucknow\nIndira Nagar, Lucknow"}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGeocode}
                disabled={geocoding}
                className="flex-1 py-2.5 bg-water-600 text-white font-semibold rounded-xl hover:bg-water-700 disabled:opacity-50 shadow-md transition-all"
              >
                {geocoding ? 'Geocoding...' : 'Geocode Addresses'}
              </button>
              <button
                onClick={handleOptimize}
                disabled={optimizing || successful.length < 2}
                className="flex-1 py-2.5 bg-leaf-600 text-white font-semibold rounded-xl hover:bg-leaf-700 disabled:opacity-50 shadow-md transition-all"
              >
                {optimizing ? 'Optimizing...' : 'Optimize Route'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {geocoded.length > 0 && (
            <div className="bg-white rounded-xl border border-water-200 shadow-lg p-6">
              <h3 className="font-bold text-water-800 mb-3">
                Geocoded Locations
              </h3>
              <div className="space-y-2">
                {geocoded.map((g, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm rounded-lg px-4 py-2.5 ${
                      g.success ? 'bg-water-50' : 'bg-red-50'
                    }`}
                  >
                    <span className="font-bold text-water-600 w-6">
                      {i === 0 ? '🟢' : g.success ? `${i}.` : '❌'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-800 block truncate">
                        {g.display_name || g.address}
                      </span>
                      {g.success && g.latitude != null ? (
                        <span className="text-gray-400 text-xs">
                          {g.latitude.toFixed(4)}, {g.longitude!.toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-red-400 text-xs">
                          Could not geocode this address
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {route && (
            <div className="bg-white rounded-xl border border-leaf-200 shadow-lg p-6">
              <h3 className="font-bold text-leaf-800 mb-3">
                Optimized Route
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Total distance: ~{route.total_distance_km.toFixed(1)} km
              </p>
              <div className="space-y-2">
                {route.ordered_stops.map((stop) => (
                  <div
                    key={stop.order}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="text-leaf-600 font-bold w-6">{stop.order}.</span>
                    <span className="flex-1">{stop.label || `${stop.latitude.toFixed(4)}, ${stop.longitude.toFixed(4)}`}</span>
                    <span className="text-gray-400 text-xs">
                      +{stop.distance_from_previous_km.toFixed(1)} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <MapView
            markers={markers}
            routePositions={routePositions}
            className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg"
            zoom={geocoded.length > 0 ? 12 : 11}
            center={
              successful.length > 0
                ? [successful[0].latitude!, successful[0].longitude!]
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
