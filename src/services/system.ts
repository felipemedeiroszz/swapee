import { apiGet, apiPost } from '@/lib/api';

export type CleanupResult = {
  deletedItems: number;
  deletedImages: number;
  errors: string[];
  message: string;
};

export async function getWelcomeMessage(): Promise<string> {
  const res = await apiGet<any>('/');
  if (typeof res === 'string') return res;
  if (res?.message && typeof res.message === 'string') return res.message;
  try {
    return JSON.stringify(res);
  } catch {
    return 'Bem-vindo!';
  }
}

export async function runManualCleanup(): Promise<CleanupResult> {
  // API documenta 201 Created com corpo JSON
  const res = await apiPost<CleanupResult>('/cleanup/run-manual', {});
  return res;
}