import { apiGet } from '@/lib/api';

export type HealthStatus = 'ok' | 'error';
export type UpDown = 'up' | 'down';

export type ComponentStatus = {
  status: UpDown;
  message?: string;
};

export type HealthResponse = {
  status: HealthStatus;
  info: Record<string, ComponentStatus>;
  error: Record<string, ComponentStatus>;
  details: Record<string, ComponentStatus>;
};

export type AppInfo = Record<string, unknown>;

export const getHealthOverall = () => apiGet<HealthResponse>('/api/health');
export const getHealthDatabase = () => apiGet<HealthResponse>('/api/health/database');
export const getHealthRedis = () => apiGet<HealthResponse>('/api/health/redis');
export const getHealthMemory = () => apiGet<HealthResponse>('/api/health/memory');
export const getHealthDisk = () => apiGet<HealthResponse>('/api/health/disk');
export const getHealthInfo = () => apiGet<AppInfo>('/api/health/info');