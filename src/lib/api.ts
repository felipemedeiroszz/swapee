const API_URL_ENV = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = API_URL_ENV ?? '';

if (!API_URL_ENV) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL is not set. Falling back to same-origin for API requests.');
}

export type ApiError = {
  statusCode?: number;
  message?: string;
  error?: unknown;
};

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      statusCode: res.status,
      message: typeof body === 'string' ? body : body?.message || 'Erro na requisição',
      error: body,
    };
    throw err;
  }

  return body as T;
}

export async function apiPost<T>(path: string, data?: unknown, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      statusCode: res.status,
      message: typeof body === 'string' ? body : body?.message || 'Erro na requisição',
      error: body,
    };
    throw err;
  }

  return body as T;
}

export async function apiPut<T>(path: string, data?: unknown, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      statusCode: res.status,
      message: typeof body === 'string' ? body : body?.message || 'Erro na requisição',
      error: body,
    };
    throw err;
  }

  return body as T;
}

export async function apiPatch<T>(path: string, data?: unknown, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      statusCode: res.status,
      message: typeof body === 'string' ? body : body?.message || 'Erro na requisição',
      error: body,
    };
    throw err;
  }

  return body as T;
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      statusCode: res.status,
      message: typeof body === 'string' ? body : body?.message || 'Erro na requisição',
      error: body,
    };
    throw err;
  }

  return body as T;
}

export async function apiUpload<T>(path: string, formData: FormData, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // DO NOT set Content-Type for FormData; browser handles boundary
      ...(init?.headers || {}),
    },
    body: formData,
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      statusCode: res.status,
      message: typeof body === 'string' ? body : body?.message || 'Erro na requisição',
      error: body,
    };
    throw err;
  }

  return body as T;
}