export interface DriveAddress {
  id: string;
  drive_id: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  order_index: number | null;
  created_at: string;
}

export interface Drive {
  id: string;
  name: string;
  description: string | null;
  planned_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  addresses: DriveAddress[];
  address_count?: number;
}

export interface Distribution {
  id: string;
  drive_id: string | null;
  name: string;
  contact: string | null;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  water_bowl_photo: string | null;
  owner_photo: string | null;
  created_at: string;
}

export interface GeocodedAddress {
  address: string;
  latitude: number | null;
  longitude: number | null;
  display_name: string | null;
  success: boolean;
}

export interface GeocodeResponse {
  results: GeocodedAddress[];
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  label?: string | null;
}

export interface OptimizedStop {
  order: number;
  latitude: number;
  longitude: number;
  label: string | null;
  distance_from_previous_km: number;
}

export interface OptimizedRoute {
  ordered_stops: OptimizedStop[];
  total_distance_km: number;
}

export interface Stats {
  total_distributions: number;
  total_drives: number;
  drives_completed: number;
  drives_planned: number;
  unique_addresses: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'member' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Attachment {
  id: string;
  blob_name: string;
  blob_url: string;
  original_filename: string | null;
  content_type: string | null;
  size_bytes: number | null;
  entity_type: string;
  entity_id: string | null;
  field_name: string | null;
  uploaded_by: string | null;
  created_at: string;
}
