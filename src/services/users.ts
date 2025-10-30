import { apiGet, apiPost, apiPut, apiDelete, apiUpload, ApiError } from '@/lib/api';

export type UserProfilePayload = {
  nome?: string;
  email?: string;
  telefone?: string;
  localizacao?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  redesSociais?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type UserSettingsPayload = {
  privacidade: {
    perfilPublico: boolean;
    mostrarTelefone: boolean;
    mostrarLocalizacao: boolean;
  };
};

export type AvatarUploadResponse = {
  avatarUrl: string;
  message?: string;
};

export type RatingPayload = {
  rating: number;
  comment?: string;
  transactionType: string; // e.g. 'troca'
  conversationId?: string;
  itemId?: string;
  aspects?: Record<string, number>;
  isPublic?: boolean;
};

export type RatingsListParams = {
  page?: number; // default 1
  limit?: number; // default 10
};

export type AvatarUrlResponse = { url: string };

export async function getUserProfile<T = unknown>(id: string): Promise<T> {
  return apiGet<T>(`/users/${id}`);
}

export async function updateUserProfile<T = unknown>(id: string, payload: UserProfilePayload): Promise<T> {
  return apiPut<T>(`/users/${id}`, payload);
}

export async function deleteUser(id: string): Promise<void> {
  await apiDelete<void>(`/users/${id}`);
}

export async function changeUserPassword(id: string, payload: ChangePasswordPayload): Promise<void> {
  await apiPut<void>(`/users/${id}/password`, payload);
}

export async function getUserSettings<T = unknown>(id: string): Promise<T> {
  return apiGet<T>(`/users/${id}/settings`);
}

export async function updateUserSettings<T = unknown>(id: string, payload: UserSettingsPayload): Promise<T> {
  return apiPut<T>(`/users/${id}/settings`, payload);
}

export async function uploadAvatar(file: File): Promise<AvatarUploadResponse> {
  const fd = new FormData();
  fd.append('avatar', file);
  return apiUpload<AvatarUploadResponse>(`/users/avatar`, fd);
}

export async function createRating<T = unknown>(id: string, payload: RatingPayload): Promise<T> {
  return apiPost<T>(`/users/${id}/ratings`, payload);
}

export async function getRatings<T = unknown>(id: string, params: RatingsListParams = {}): Promise<T> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiGet<T>(`/users/${id}/ratings?${qs.toString()}`);
}

export async function getAvatarUrl(id: string): Promise<AvatarUrlResponse> {
  return apiGet<AvatarUrlResponse>(`/users/${id}/avatar`);
}