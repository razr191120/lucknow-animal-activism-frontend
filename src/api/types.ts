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
  total_rescues: number;
  open_rescues: number;
  resolved_rescues: number;
  total_adoptions: number;
  open_adoptions: number;
  fulfilled_adoptions: number;
  total_donations_inr: number;
  donation_count: number;
  total_volunteers: number;
  active_volunteers: number;
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

/** L.A.A.P — Lucknow Animal Activism (same backend `/api/v1/laap`) */
export interface LaapAdoption {
  id: string;
  user_id: string;
  creator_full_name: string | null;
  title: string;
  animal_name: string | null;
  description: string | null;
  contact_phone: string | null;
  location_hint: string | null;
  status: string;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface LaapRescue {
  id: string;
  user_id: string;
  creator_full_name: string | null;
  title: string;
  description: string | null;
  location_address: string;
  contact_phone: string | null;
  animal_condition: string | null;
  urgency: string;
  status: string;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface LaapDonation {
  id: string;
  user_id: string;
  creator_full_name: string | null;
  title: string;
  description: string | null;
  items_or_need_summary: string | null;
  how_to_donate: string | null;
  contact_phone: string | null;
  upi_id: string | null;
  bank_account_hint: string | null;
  target_amount_inr: string | null;
  status: string;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

// ── Volunteer ──────────────────────────────────────

export interface Volunteer {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  skills: string | null;
  availability: string | null;
  area: string | null;
  status: string;
  total_hours: number;
  badge: string;
  joined_at: string;
}

export interface VolunteerActivity {
  id: string;
  volunteer_id: string;
  activity_type: string;
  entity_id: string | null;
  description: string | null;
  hours: number;
  date: string;
  created_at: string;
}

export interface LeaderboardEntry {
  volunteer_id: string;
  full_name: string;
  total_hours: number;
  badge: string;
  area: string | null;
}

// ── Donation Record ────────────────────────────────

export interface DonationRecord {
  id: string;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  amount_inr: number;
  purpose: string | null;
  payment_mode: string;
  receipt_number: string;
  campaign_id: string | null;
  recorded_by: string;
  date: string;
  notes: string | null;
  created_at: string;
}

export interface DonationStats {
  total_amount_inr: number;
  donation_count: number;
}

// ── Adoption Application ───────────────────────────

export interface AdoptionApplication {
  id: string;
  adoption_id: string;
  applicant_id: string;
  applicant_name: string;
  applicant_phone: string | null;
  applicant_address: string | null;
  why_adopt: string | null;
  has_experience: boolean;
  living_situation: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Rescue Assignment ──────────────────────────────

export interface RescueAssignment {
  id: string;
  rescue_id: string;
  volunteer_id: string;
  volunteer_name: string | null;
  assigned_by: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
