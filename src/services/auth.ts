import { apiPost, ApiError } from '@/lib/api';

export type LinkOAuthPayload = {
  provider: 'google' | 'apple';
  email: string;
  password: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function linkOAuth(payload: LinkOAuthPayload): Promise<ApiResponse> {
  try {
    const res = await apiPost<ApiResponse>('/api/auth/link-oauth', payload);
    return res;
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}