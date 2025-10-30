import { apiGet, apiUpload, apiPut, apiDelete, apiPost } from '@/lib/api';

export type ConversaParticipante = {
  id: string;
  nome?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string; // ISO date
};

export type ConversaItem = {
  id: string;
  titulo?: string;
  imagem?: string;
};

export type Conversa = {
  id: string;
  tipo?: string;
  outroParticipante: ConversaParticipante;
  item?: ConversaItem;
  ultimaMensagem?: string;
  dataUltimaMensagem?: string; // ISO date
  mensagensNaoLidas?: number;
  silenciada?: boolean;
  fixada?: boolean;
  arquivada?: boolean;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
};

export type ListUserConversationsResponse = {
  conversations: Conversa[];
  total: number;
  totalUnread: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
};

export type ConversationFilter = 'all' | 'unread' | 'archived' | 'pinned';

export async function listUserConversations(
  userId: string,
  opts: { filter?: ConversationFilter; page?: number; limit?: number } = {}
): Promise<ListUserConversationsResponse> {
  const qs = new URLSearchParams();
  qs.set('filter', (opts.filter ?? 'all'));
  qs.set('page', String(opts.page ?? 1));
  qs.set('limit', String(opts.limit ?? 20));
  return apiGet<ListUserConversationsResponse>(`/conversations/user/${encodeURIComponent(userId)}?${qs.toString()}`);
}

export type MensagemAnexo = {
  url?: string;
  nome?: string;
  tipo?: string;
  tamanho?: number;
};

export type Mensagem = {
  id: string;
  conversacaoId: string;
  remetenteId: string;
  remetenteNome?: string;
  remetenteAvatar?: string;
  texto?: string;
  tipo?: string;
  anexos?: MensagemAnexo[];
  lida?: boolean;
  dataLeitura?: string;
  entregue?: boolean;
  dataEntrega?: string;
  timestamp: string;
  mensagemPaiId?: string;
  editada?: boolean;
  dataEdicao?: string;
  isOwn?: boolean;
};

export type ListMessagesResponse = {
  messages: Mensagem[];
  total: number;
  hasMore: boolean;
  lastMessageId?: string;
};

export async function listMessages(
  conversacaoId: string,
  opts: { limit?: number; before?: string } = {}
): Promise<ListMessagesResponse> {
  const qs = new URLSearchParams();
  qs.set('limit', String(opts.limit ?? 50));
  if (opts.before) qs.set('before', opts.before);
  return apiGet<ListMessagesResponse>(`/conversations/${encodeURIComponent(conversacaoId)}/messages?${qs.toString()}`);
}

export type SendMessagePayload = {
  texto: string;
  tipo?: string;
  mensagemPaiId?: string;
  files?: File[]; // arquivos locais a enviar como anexos
};

export type SendMessageResponse = Mensagem;

export async function sendMessage(
  conversacaoId: string,
  data: SendMessagePayload
): Promise<SendMessageResponse> {
  const form = new FormData();
  form.append('texto', data.texto);
  if (data.tipo) form.append('tipo', data.tipo);
  if (data.mensagemPaiId) form.append('mensagemPaiId', data.mensagemPaiId);
  if (data.files && data.files.length) {
    // Enviar anexos como múltiplas partes. Nome do campo assumido como 'anexos'.
    for (const file of data.files) {
      form.append('anexos', file, file.name);
    }
  }
  return apiUpload<SendMessageResponse>(`/conversations/${encodeURIComponent(conversacaoId)}/messages`, form);
}

export type MarkReadResponse = { message?: string };
export async function markConversationRead(conversacaoId: string): Promise<MarkReadResponse> {
  return apiPut<MarkReadResponse>(`/conversations/${encodeURIComponent(conversacaoId)}/read`);
}

export type UpdateMuteResponse = { message?: string };
export async function updateConversationMute(conversacaoId: string, mute: boolean): Promise<UpdateMuteResponse> {
  const qs = new URLSearchParams();
  qs.set('mute', String(mute));
  return apiPut<UpdateMuteResponse>(`/conversations/${encodeURIComponent(conversacaoId)}/mute?${qs.toString()}`);
}

export type UpdatePinResponse = { message?: string };
export async function updateConversationPin(conversacaoId: string, pin: boolean): Promise<UpdatePinResponse> {
  const qs = new URLSearchParams();
  qs.set('pin', String(pin));
  return apiPut<UpdatePinResponse>(`/conversations/${encodeURIComponent(conversacaoId)}/pin?${qs.toString()}`);
}

export type ArchiveConversationResponse = { message?: string };
export async function archiveConversation(conversacaoId: string): Promise<ArchiveConversationResponse> {
  return apiDelete<ArchiveConversationResponse>(`/conversations/${encodeURIComponent(conversacaoId)}`);
}

export type BlockUserPayload = { motivo: string };
export type BlockUserResponse = { message?: string };
export async function blockUser(userId: string, data: BlockUserPayload): Promise<BlockUserResponse> {
  return apiPost<BlockUserResponse>(`/conversations/users/${encodeURIComponent(userId)}/block`, data);
}

export type ReportUserPayload = { motivo: string; detalhes?: string };
export type ReportUserResponse = { message?: string };
export async function reportUser(userId: string, data: ReportUserPayload): Promise<ReportUserResponse> {
  return apiPost<ReportUserResponse>(`/conversations/users/${encodeURIComponent(userId)}/report`, data);
}