import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: { position: [number, number]; label: string; popup?: string }[];
  routePositions?: [number, number][];
  className?: string;
}

const LUCKNOW_CENTER: [number, number] = [26.8467, 80.9462];

export default function MapView({
  center = LUCKNOW_CENTER,
  zoom = 12,
  markers = [],
  routePositions,
  className = 'h-96 w-full rounded-xl overflow-hidden shadow-lg',
}: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.position}>
          {m.popup && <Popup>{m.popup}</Popup>}
        </Marker>
      ))}
      {routePositions && routePositions.length > 1 && (
        <Polyline
          positions={routePositions}
          pathOptions={{ color: '#2279e7', weight: 4, opacity: 0.8 }}
        />
      )}
    </MapContainer>
  );
}
