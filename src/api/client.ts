import axios from 'axios';
import type {
  Drive,
  Distribution,
  GeocodedAddress,
  GeocodeResponse,
  OptimizedRoute,
  RoutePoint,
  Stats,
} from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export async function getStats(): Promise<Stats> {
  const { data } = await api.get('/api/v1/stats');
  return data;
}

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

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await api.get('/health');
  return data;
}
