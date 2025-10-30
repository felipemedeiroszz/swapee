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

export const getHealthOverall = () => apiGet<HealthResponse>('/health');
export const getHealthDatabase = () => apiGet<HealthResponse>('/health/database');
export const getHealthRedis = () => apiGet<HealthResponse>('/health/redis');
export const getHealthMemory = () => apiGet<HealthResponse>('/health/memory');
export const getHealthDisk = () => apiGet<HealthResponse>('/health/disk');
export const getHealthInfo = () => apiGet<AppInfo>('/health/info');