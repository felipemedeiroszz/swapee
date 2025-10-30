import { apiPost, apiGet, ApiError } from '@/lib/api';

// Storage keys
const TOKEN_KEY = 'swepee_access_token';
const REFRESH_TOKEN_KEY = 'swepee_refresh_token';
const USER_KEY = 'swepee_user';

// Types
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

export type LoginPayload = {
  email: string;
  senha: string;
};

export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  novaSenha: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type User = {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    accessToken: string;
    refreshToken: string;
    user?: User;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    accessToken: string;
    refreshToken: string;
  };
};

// Token Management
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(refreshToken: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// Auth API Functions
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await apiPost<LoginResponse>('/auth/login', payload);
    
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      if (res.data.user) {
        setUser(res.data.user);
      }
    }
    
    return res;
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    const res = await apiPost<RegisterResponse>('/auth/register', payload);
    
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
    }
    
    return res;
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  try {
    await apiPost('/auth/forgot-password', payload);
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  try {
    await apiPost('/auth/reset-password', payload);
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}

export async function refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }
    
    const res = await apiPost<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken: refreshTokenValue }
    );
    
    setToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    
    return res;
  } catch (err) {
    clearTokens();
    const e = err as ApiError;
    throw e;
  }
}

export async function logout(): Promise<void> {
  try {
    const token = getToken();
    if (token) {
      await apiPost('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (err) {
    // Logout even if API call fails
    console.warn('Logout API call failed:', err);
  } finally {
    clearTokens();
  }
}

export async function getProfile(): Promise<User> {
  try {
    const res = await apiGet<User>('/auth/me');
    setUser(res);
    return res;
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}

export async function linkOAuth(payload: LinkOAuthPayload): Promise<ApiResponse> {
  try {
    const res = await apiPost<ApiResponse>('/auth/link-oauth', payload);
    return res;
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}