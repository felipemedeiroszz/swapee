import { apiPost, apiGet, ApiError } from '@/lib/api';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

// Storage keys
const TOKEN_KEY = 'swepee_access_token';
const REFRESH_TOKEN_KEY = 'swepee_refresh_token';
const USER_KEY = 'swepee_user';

// Helper functions for secure storage
async function setSecureItem(key: string, value: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    const result = await Preferences.get({ key });
    return result.value;
  } else {
    return localStorage.getItem(key);
  }
}

async function removeSecureItem(key: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.remove({ key });
  } else {
    localStorage.removeItem(key);
  }
}

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
export async function getToken(): Promise<string | null> {
  return await getSecureItem(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return await getSecureItem(REFRESH_TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await setSecureItem(TOKEN_KEY, token);
}

export async function setRefreshToken(refreshToken: string): Promise<void> {
  await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
  await removeSecureItem(TOKEN_KEY);
  await removeSecureItem(REFRESH_TOKEN_KEY);
  await removeSecureItem(USER_KEY);
}

export async function getUser(): Promise<User | null> {
  const userStr = await getSecureItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export async function setUser(user: User): Promise<void> {
  await setSecureItem(USER_KEY, JSON.stringify(user));
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

// Synchronous versions for backward compatibility (use async versions when possible)
export function getTokenSync(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshTokenSync(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Auth API Functions
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await apiPost<LoginResponse>('/auth/login', payload);
    
    if (res.success && res.data) {
      await setToken(res.data.accessToken);
      await setRefreshToken(res.data.refreshToken);
      if (res.data.user) {
        await setUser(res.data.user);
      } else {
        // Se não veio o usuário na resposta, buscar do perfil
        try {
          const userProfile = await getProfile();
          await setUser(userProfile);
        } catch (profileError) {
          console.warn('Não foi possível buscar perfil após login:', profileError);
        }
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
      await setToken(res.data.accessToken);
      await setRefreshToken(res.data.refreshToken);
      // Buscar perfil do usuário após registro
      try {
        const userProfile = await getProfile();
        await setUser(userProfile);
      } catch (profileError) {
        // Se falhar ao buscar perfil, não impede o registro
        console.warn('Não foi possível buscar perfil após registro:', profileError);
      }
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
    const refreshTokenValue = await getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }
    
    const res = await apiPost<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken: refreshTokenValue }
    );
    
    await setToken(res.accessToken);
    await setRefreshToken(res.refreshToken);
    
    return res;
  } catch (err) {
    await clearTokens();
    const e = err as ApiError;
    throw e;
  }
}

export async function logout(): Promise<void> {
  try {
    const token = await getToken();
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
    await clearTokens();
  }
}

export async function getProfile(): Promise<User> {
  try {
    const res = await apiGet<User>('/auth/me');
    await setUser(res);
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