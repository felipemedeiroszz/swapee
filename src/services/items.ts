import { apiGet, apiUpload, ApiError, apiPost, apiDelete, apiPatch } from '@/lib/api';

export type Item = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  tipo: 'troca' | 'doacao' | 'venda';
  preco?: number;
  condicao: 'novo' | 'seminovo' | 'usado';
  imagens?: string[];
  status?: 'ativo' | 'pendente' | 'inativo' | 'vendido' | 'trocado';
  localizacao: string;
  latitude?: number;
  longitude?: number;
  visualizacoes?: number;
  likes?: number;
  matches?: number;
  dataEncerramento?: string;
  destacado?: boolean;
  tags?: string[];
  informacoesExtras?: Record<string, unknown>;
  usuario?: {
    id: string;
    nome?: string;
    avatar?: string;
    avaliacaoMedia?: string;
    totalAvaliacoes?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type CreateItemPayload = {
  titulo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  tipo: 'troca' | 'doacao' | 'venda';
  preco?: number;
  condicao: 'novo' | 'seminovo' | 'usado';
  localizacao: string;
  latitude?: number;
  longitude?: number;
  destacado?: boolean;
  tags?: string[];
  informacoesExtras?: Record<string, unknown>;
};

export type UpdateItemPayload = Partial<Omit<CreateItemPayload, 'tipo'>> & {
  status?: 'ativo' | 'pendente' | 'inativo' | 'vendido' | 'trocado';
};

export type ListItemsParams = {
  page?: number; // default 1
  limit?: number; // default 10
  search?: string;
  categoria?: string;
  subcategoria?: string;
  tipo?: 'troca' | 'doacao' | 'venda';
  condicao?: 'novo' | 'seminovo' | 'usado';
  status?: 'ativo' | 'pendente' | 'inativo' | 'vendido' | 'trocado';
  precoMin?: number;
  precoMax?: number;
  localizacao?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // km, default 10
  destacado?: boolean;
  tags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'visualizacoes' | 'likes' | 'preco' | 'titulo';
  sortOrder?: 'ASC' | 'DESC';
};

export type ListItemsResponse = {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type AddImagesResponse = {
  imagens: string[];
  totalImagens: number;
  message?: string;
};

export type ItemStats = {
  visualizacoes: number;
  likes: number;
  matches: number;
  visualizacoesHoje: number;
  visualizacoesSemana: number;
  visualizacoesMes: number;
};

export async function createItem(payload: CreateItemPayload, imagens?: File[]): Promise<Item> {
  try {
    const fd = new FormData();
    fd.append('titulo', payload.titulo);
    fd.append('descricao', payload.descricao);
    fd.append('categoria', payload.categoria);
    fd.append('subcategoria', payload.subcategoria);
    fd.append('tipo', payload.tipo);
    if (payload.preco !== undefined && payload.preco !== null) {
      fd.append('preco', String(payload.preco));
    }
    fd.append('condicao', payload.condicao);
    fd.append('localizacao', payload.localizacao);
    if (payload.latitude !== undefined) fd.append('latitude', String(payload.latitude));
    if (payload.longitude !== undefined) fd.append('longitude', String(payload.longitude));
    if (payload.destacado !== undefined) fd.append('destacado', String(payload.destacado));
    if (payload.tags && payload.tags.length) {
      payload.tags.forEach((tag) => fd.append('tags', tag));
    }
    if (payload.informacoesExtras) {
      fd.append('informacoesExtras', JSON.stringify(payload.informacoesExtras));
    }
    if (imagens && imagens.length) {
      imagens.forEach((file) => fd.append('images', file));
    }

    // A API pode retornar { success, message, data } ou diretamente o Item
    const res = await apiUpload<{ success: boolean; message?: string; data?: Item } | Item>('/items', fd);
    
    // Se veio no formato { success, data }, extrair o item de data
    if (typeof res === 'object' && res !== null && 'success' in res && 'data' in res) {
      if (res.success && res.data) {
        return res.data;
      } else {
        throw new Error(res.message || 'Erro ao criar item');
      }
    }
    
    // Se veio diretamente como Item
    return res as Item;
  } catch (err) {
    const e = err as ApiError;
    throw e;
  }
}

export async function listItems(params: ListItemsParams = {}): Promise<ListItemsResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (params.search) qs.set('search', params.search);
  if (params.categoria) qs.set('categoria', params.categoria);
  if (params.subcategoria) qs.set('subcategoria', params.subcategoria);
  if (params.tipo) qs.set('tipo', params.tipo);
  if (params.condicao) qs.set('condicao', params.condicao);
  if (params.status) qs.set('status', params.status);
  if (params.precoMin !== undefined) qs.set('precoMin', String(params.precoMin));
  if (params.precoMax !== undefined) qs.set('precoMax', String(params.precoMax));
  if (params.localizacao) qs.set('localizacao', params.localizacao);
  if (params.latitude !== undefined) qs.set('latitude', String(params.latitude));
  if (params.longitude !== undefined) qs.set('longitude', String(params.longitude));
  if (params.radius !== undefined) qs.set('radius', String(params.radius));
  if (params.destacado !== undefined) qs.set('destacado', String(params.destacado));
  if (params.tags && params.tags.length) {
    params.tags.forEach((tag) => qs.append('tags', tag));
  }
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);

  return apiGet<ListItemsResponse>(`/items?${qs.toString()}`);
}

// Lista itens de um usuário específico
export async function listUserItems(userId: string, params: ListItemsParams = {}): Promise<ListItemsResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (params.search) qs.set('search', params.search);
  if (params.categoria) qs.set('categoria', params.categoria);
  if (params.subcategoria) qs.set('subcategoria', params.subcategoria);
  if (params.tipo) qs.set('tipo', params.tipo);
  if (params.condicao) qs.set('condicao', params.condicao);
  if (params.status) qs.set('status', params.status);
  if (params.precoMin !== undefined) qs.set('precoMin', String(params.precoMin));
  if (params.precoMax !== undefined) qs.set('precoMax', String(params.precoMax));
  if (params.localizacao) qs.set('localizacao', params.localizacao);
  if (params.latitude !== undefined) qs.set('latitude', String(params.latitude));
  if (params.longitude !== undefined) qs.set('longitude', String(params.longitude));
  if (params.radius !== undefined) qs.set('radius', String(params.radius));
  if (params.destacado !== undefined) qs.set('destacado', String(params.destacado));
  if (params.tags && params.tags.length) {
    params.tags.forEach((tag) => qs.append('tags', tag));
  }
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);

  return apiGet<ListItemsResponse>(`/items/user/${encodeURIComponent(userId)}?${qs.toString()}`);
}

// Buscar item por ID
export async function getItemById(id: string, incrementView?: boolean): Promise<Item> {
  const qs = new URLSearchParams();
  if (incrementView !== undefined) {
    qs.set('incrementView', String(incrementView));
  }
  const url = qs.toString() ? `/items/${encodeURIComponent(id)}?${qs.toString()}` : `/items/${encodeURIComponent(id)}`;
  return apiGet<Item>(url);
}

// Atualizar item (PATCH /items/{id})
export async function updateItem(id: string, payload: UpdateItemPayload): Promise<Item> {
  return apiPatch<Item>(`/items/${encodeURIComponent(id)}`, payload);
}

// Remover item (DELETE /items/{id})
export async function removeItem(id: string): Promise<{ message?: string }> {
  return apiDelete<{ message?: string }>(`/items/${encodeURIComponent(id)}`);
}

// Adicionar imagens (POST /items/{id}/images)
export async function addItemImages(id: string, imagens: File[]): Promise<AddImagesResponse> {
  const fd = new FormData();
  imagens.forEach((file) => fd.append('images', file));
  return apiUpload<AddImagesResponse>(`/items/${encodeURIComponent(id)}/images`, fd);
}

// Remover imagem (DELETE /items/{id}/images/{imageIndex})
export async function removeItemImage(id: string, imageIndex: number | string): Promise<{ message?: string }> {
  return apiDelete<{ message?: string }>(`/items/${encodeURIComponent(id)}/images/${encodeURIComponent(String(imageIndex))}`);
}

// Incrementar visualizações (POST /items/{id}/views)
export async function incrementItemViews(id: string): Promise<{ message?: string }> {
  return apiPost<{ message?: string }>(`/items/${encodeURIComponent(id)}/views`);
}

// Obter estatísticas (GET /items/{id}/stats)
export async function getItemStats(id: string): Promise<ItemStats> {
  return apiGet<ItemStats>(`/items/${encodeURIComponent(id)}/stats`);
}

// Atualizar status (PATCH /items/{id}/status)
export async function updateItemStatus(id: string, status: 'ativo' | 'pendente' | 'inativo' | 'vendido' | 'trocado'): Promise<Item> {
  return apiPatch<Item>(`/items/${encodeURIComponent(id)}/status`, { status });
}