import axios from 'axios';
import type {
  AdoptionApplication,
  Attachment,
  DonationRecord,
  DonationStats,
  Drive,
  Distribution,
  GeocodedAddress,
  GeocodeResponse,
  LaapAdoption,
  LaapDonation,
  LaapRescue,
  LeaderboardEntry,
  OptimizedRoute,
  RescueAssignment,
  RoutePoint,
  Stats,
  TokenResponse,
  User,
  Volunteer,
  VolunteerActivity,
} from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

// ── Auth ──────────────────────────────────────────

export async function signup(
  email: string,
  full_name: string,
  password: string,
): Promise<TokenResponse> {
  const { data } = await api.post('/api/v1/auth/signup', {
    email,
    full_name,
    password,
  });
  return data;
}

/** L.A.A.P signup — stores Aadhaar + PAN on the same `users` row. */
export async function signupLaap(
  email: string,
  full_name: string,
  password: string,
  aadhaar_number: string,
  pan_number: string,
): Promise<TokenResponse> {
  const aadhaar = aadhaar_number.replace(/\s/g, '');
  const { data } = await api.post('/api/v1/auth/signup-laap', {
    email,
    full_name,
    password,
    aadhaar_number: aadhaar,
    pan_number: pan_number.replace(/\s/g, '').toUpperCase(),
  });
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const { data } = await api.post('/api/v1/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get('/api/v1/auth/me');
  return data;
}

// ── Stats ─────────────────────────────────────────

export async function getStats(): Promise<Stats> {
  const { data } = await api.get('/api/v1/stats');
  return data;
}

// ── Drives ────────────────────────────────────────

export async function getDrives(): Promise<Drive[]> {
  const { data } = await api.get('/api/v1/drives/');
  return data;
}

export async function getDrive(id: string): Promise<Drive> {
  const { data } = await api.get(`/api/v1/drives/${id}`);
  return data;
}

export async function createDrive(drive: {
  name: string;
  description?: string;
  planned_date: string;
}): Promise<Drive> {
  const { data } = await api.post('/api/v1/drives/', drive);
  return data;
}

export async function addAddresses(
  driveId: string,
  addresses: string[],
): Promise<Drive> {
  const { data } = await api.post(`/api/v1/drives/${driveId}/addresses`, {
    addresses,
  });
  return data;
}

// ── Geocoding ─────────────────────────────────────

export async function geocodeAddresses(
  addresses: string[],
): Promise<GeocodedAddress[]> {
  const { data } = await api.post<GeocodeResponse>('/api/v1/geocode', {
    addresses,
  });
  return data.results;
}

export async function optimizeRoute(
  start: RoutePoint,
  destinations: RoutePoint[],
): Promise<OptimizedRoute> {
  const { data } = await api.post('/api/v1/optimize-route', {
    start,
    destinations,
  });
  return data;
}

// ── Distributions ─────────────────────────────────

export async function createDistribution(
  formData: FormData,
): Promise<Distribution> {
  const { data } = await api.post('/api/v1/distributions/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getDistributions(): Promise<Distribution[]> {
  const { data } = await api.get('/api/v1/distributions/');
  return data;
}

export async function getDistribution(id: string): Promise<Distribution> {
  const { data } = await api.get(`/api/v1/distributions/${id}`);
  return data;
}

// ── Admin ─────────────────────────────────────────

export async function adminGetUsers(): Promise<User[]> {
  const { data } = await api.get('/api/v1/admin/users');
  return data;
}

export async function adminCreateUser(user: {
  email: string;
  full_name: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post('/api/v1/admin/users', user);
  return data;
}

export async function adminUpdateUser(
  userId: string,
  updates: { full_name?: string; email?: string; role?: string; is_active?: boolean },
): Promise<User> {
  const { data } = await api.patch(`/api/v1/admin/users/${userId}`, updates);
  return data;
}

export async function adminResetPassword(
  userId: string,
  new_password: string,
): Promise<void> {
  await api.patch(`/api/v1/admin/users/${userId}/password`, { new_password });
}

export async function adminDeleteUser(userId: string): Promise<void> {
  await api.delete(`/api/v1/admin/users/${userId}`);
}

export async function adminDeleteDrive(driveId: string): Promise<void> {
  await api.delete(`/api/v1/admin/drives/${driveId}`);
}

export async function adminDeleteDistribution(distId: string): Promise<void> {
  await api.delete(`/api/v1/admin/distributions/${distId}`);
}

export async function adminGetAttachments(): Promise<Attachment[]> {
  const { data } = await api.get('/api/v1/attachments/');
  return data;
}

export async function adminDeleteAttachment(attachmentId: string): Promise<void> {
  await api.delete(`/api/v1/admin/attachments/${attachmentId}`);
}

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await api.get('/health');
  return data;
}

// ── L.A.A.P (Lucknow Animal Activism) ─────────────────────────────

export async function listLaapAdoptions(
  status_filter?: string,
): Promise<LaapAdoption[]> {
  const { data } = await api.get('/api/v1/laap/adoptions', {
    params: status_filter ? { status_filter } : {},
  });
  return data;
}

export async function getLaapAdoption(id: string): Promise<LaapAdoption> {
  const { data } = await api.get(`/api/v1/laap/adoptions/${id}`);
  return data;
}

export async function createLaapAdoption(
  formData: FormData,
): Promise<LaapAdoption> {
  const { data } = await api.post('/api/v1/laap/adoptions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function listLaapRescues(
  status_filter?: string,
): Promise<LaapRescue[]> {
  const { data } = await api.get('/api/v1/laap/rescues', {
    params: status_filter ? { status_filter } : {},
  });
  return data;
}

export async function getLaapRescue(id: string): Promise<LaapRescue> {
  const { data } = await api.get(`/api/v1/laap/rescues/${id}`);
  return data;
}

export async function createLaapRescue(
  formData: FormData,
): Promise<LaapRescue> {
  const { data } = await api.post('/api/v1/laap/rescues', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function listLaapDonations(
  status_filter?: string,
): Promise<LaapDonation[]> {
  const { data } = await api.get('/api/v1/laap/donations', {
    params: status_filter ? { status_filter } : {},
  });
  return data;
}

export async function getLaapDonation(id: string): Promise<LaapDonation> {
  const { data } = await api.get(`/api/v1/laap/donations/${id}`);
  return data;
}

export async function createLaapDonation(
  formData: FormData,
): Promise<LaapDonation> {
  const { data } = await api.post('/api/v1/laap/donations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateLaapRescue(
  id: string,
  updates: Record<string, unknown>,
): Promise<LaapRescue> {
  const { data } = await api.patch(`/api/v1/laap/rescues/${id}`, updates);
  return data;
}

export async function updateLaapAdoption(
  id: string,
  updates: Record<string, unknown>,
): Promise<LaapAdoption> {
  const { data } = await api.patch(`/api/v1/laap/adoptions/${id}`, updates);
  return data;
}

// ── Adoption Applications ────────────────────────────────────

export async function applyToAdopt(
  adoptionId: string,
  body: {
    applicant_name: string;
    applicant_phone?: string;
    applicant_address?: string;
    why_adopt?: string;
    has_experience?: boolean;
    living_situation?: string;
  },
): Promise<AdoptionApplication> {
  const { data } = await api.post(`/api/v1/laap/adoptions/${adoptionId}/apply`, body);
  return data;
}

export async function listAdoptionApplications(
  adoptionId: string,
): Promise<AdoptionApplication[]> {
  const { data } = await api.get(`/api/v1/laap/adoptions/${adoptionId}/applications`);
  return data;
}

export async function getMyApplications(): Promise<AdoptionApplication[]> {
  const { data } = await api.get('/api/v1/laap/applications/mine');
  return data;
}

export async function reviewApplication(
  appId: string,
  updates: { status?: string; admin_notes?: string },
): Promise<AdoptionApplication> {
  const { data } = await api.patch(`/api/v1/laap/applications/${appId}`, updates);
  return data;
}

// ── Rescue Assignments ───────────────────────────────────────

export async function assignVolunteerToRescue(
  rescueId: string,
  body: { volunteer_id: string; notes?: string },
): Promise<RescueAssignment> {
  const { data } = await api.post(`/api/v1/laap/rescues/${rescueId}/assign`, body);
  return data;
}

export async function listRescueAssignments(
  rescueId: string,
): Promise<RescueAssignment[]> {
  const { data } = await api.get(`/api/v1/laap/rescues/${rescueId}/assignments`);
  return data;
}

export async function updateAssignment(
  assignmentId: string,
  updates: { status?: string; notes?: string },
): Promise<RescueAssignment> {
  const { data } = await api.patch(`/api/v1/laap/assignments/${assignmentId}`, updates);
  return data;
}

export async function addRescueFollowUpPhotos(
  rescueId: string,
  formData: FormData,
): Promise<{ photo_urls: string[] }> {
  const { data } = await api.post(`/api/v1/laap/rescues/${rescueId}/follow-up-photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ── Volunteers ───────────────────────────────────────────────

export async function volunteerSignup(body: {
  phone?: string;
  skills?: string;
  availability?: string;
  area?: string;
}): Promise<Volunteer> {
  const { data } = await api.post('/api/v1/volunteers/signup', body);
  return data;
}

export async function getVolunteerProfile(): Promise<Volunteer> {
  const { data } = await api.get('/api/v1/volunteers/me');
  return data;
}

export async function updateVolunteerProfile(
  updates: Record<string, unknown>,
): Promise<Volunteer> {
  const { data } = await api.patch('/api/v1/volunteers/me', updates);
  return data;
}

export async function listVolunteers(): Promise<Volunteer[]> {
  const { data } = await api.get('/api/v1/volunteers/');
  return data;
}

export async function logVolunteerActivity(body: {
  activity_type: string;
  entity_id?: string;
  description?: string;
  hours: number;
  date: string;
}): Promise<VolunteerActivity> {
  const { data } = await api.post('/api/v1/volunteers/activity', body);
  return data;
}

export async function getMyActivities(): Promise<VolunteerActivity[]> {
  const { data } = await api.get('/api/v1/volunteers/activity');
  return data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await api.get('/api/v1/volunteers/leaderboard');
  return data;
}

// ── Donation Records ─────────────────────────────────────────

export async function recordDonation(body: {
  donor_name: string;
  donor_email?: string;
  donor_phone?: string;
  amount_inr: number;
  purpose?: string;
  payment_mode?: string;
  campaign_id?: string;
  date: string;
  notes?: string;
}): Promise<DonationRecord> {
  const { data } = await api.post('/api/v1/donations/', body);
  return data;
}

export async function listDonationRecords(): Promise<DonationRecord[]> {
  const { data } = await api.get('/api/v1/donations/');
  return data;
}

export async function getDonationStats(): Promise<DonationStats> {
  const { data } = await api.get('/api/v1/donations/stats');
  return data;
}

export async function getDonationRecord(id: string): Promise<DonationRecord> {
  const { data } = await api.get(`/api/v1/donations/${id}`);
  return data;
}
