import { apiGet, apiPost, apiDelete } from '@/lib/api';

export type DiscoveryFeedParams = {
  page?: number; // default 1
  limit?: number; // default 20
  latitude?: number;
  longitude?: number;
  radius?: number; // km, default 50
  categoria?: string;
  tipo?: 'troca' | 'doacao' | 'venda';
  condicao?: 'novo' | 'seminovo' | 'usado';
  precoMin?: number;
  precoMax?: number;
  tags?: string[];
};

export type DiscoveryUser = {
  id: string;
  nome?: string;
  avatar?: string;
  avaliacaoMedia?: string;
  totalAvaliacoes?: number;
  distancia?: number;
};

export type DiscoveryItem = {
  id: string;
  titulo: string;
  descricao?: string;
  categoria?: string;
  subcategoria?: string;
  tipo: 'troca' | 'doacao' | 'venda';
  preco?: number;
  condicao?: 'novo' | 'seminovo' | 'usado';
  imagens?: string[];
  localizacao?: string;
  distancia?: number;
  visualizacoes?: number;
  likes?: number;
  tags?: string[];
  usuario?: DiscoveryUser;
  createdAt?: string;
};

export type DiscoveryFeedResponse = {
  items: DiscoveryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
};

export async function getDiscoveryFeed(params: DiscoveryFeedParams = {}): Promise<DiscoveryFeedResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (params.latitude !== undefined) qs.set('latitude', String(params.latitude));
  if (params.longitude !== undefined) qs.set('longitude', String(params.longitude));
  if (params.radius !== undefined) qs.set('radius', String(params.radius));
  if (params.categoria) qs.set('categoria', params.categoria);
  if (params.tipo) qs.set('tipo', params.tipo);
  if (params.condicao) qs.set('condicao', params.condicao);
  if (params.precoMin !== undefined) qs.set('precoMin', String(params.precoMin));
  if (params.precoMax !== undefined) qs.set('precoMax', String(params.precoMax));
  if (params.tags && params.tags.length) params.tags.forEach(tag => qs.append('tags', tag));
  return apiGet<DiscoveryFeedResponse>(`/api/discovery/feed?${qs.toString()}`);
}

export type LikeItemResponse = {
  message?: string;
  isMatch?: boolean;
  matchId?: string;
  conversacaoId?: string;
};

export async function likeItem(itemId: string, tipo: 'like' | 'superlike' = 'like'): Promise<LikeItemResponse> {
  return apiPost<LikeItemResponse>(`/api/discovery/like/${encodeURIComponent(itemId)}`, { tipo });
}

export async function passItem(itemId: string): Promise<{ message?: string }> {
  return apiPost<{ message?: string }>(`/api/discovery/pass/${encodeURIComponent(itemId)}`);
}

export type LikedItemsResponse = {
  items: (DiscoveryItem & {
    likeTipo?: 'like' | 'superlike';
    dataLike?: string;
    hasMatch?: boolean;
  })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
};

export async function listLikedItems(page = 1, limit = 20): Promise<LikedItemsResponse> {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  return apiGet<LikedItemsResponse>(`/api/discovery/liked-items?${qs.toString()}`);
}

export async function removeLikedItem(itemId: string): Promise<{ message?: string }> {
  return apiDelete<{ message?: string }>(`/api/discovery/liked-items/${encodeURIComponent(itemId)}`);
}


export type Match = {
  id: string;
  tipo?: string;
  dataMatch?: string;
  item: DiscoveryItem;
  outroUsuario?: DiscoveryUser;
  conversacaoId?: string;
  visualizado?: boolean;
};

export type ListMatchesResponse = {
  matches: Match[];
  total: number;
  naoVisualizados: number;
};

export async function listMatches(): Promise<ListMatchesResponse> {
  return apiGet<ListMatchesResponse>('/api/discovery/matches');
}