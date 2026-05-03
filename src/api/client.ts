import axios from 'axios';
import type {
  Attachment,
  Drive,
  Distribution,
  GeocodedAddress,
  GeocodeResponse,
  OptimizedRoute,
  RoutePoint,
  Stats,
  TokenResponse,
  User,
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
