import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Bell, BellOff, MoreVertical, Send, ShieldAlert, Eye, XCircle, MessageSquarePlus, Paperclip, Trash2, Pin, CheckCheck, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

interface Attachment {
  url: string;
  name: string;
  type: string;
}

interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  attachments?: Attachment[];
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  unread?: number;
  muted?: boolean;
  rating?: number;
  pinned?: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Ana Souza",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Combinado! Posso amanhã à tarde.",
    unread: 2,
    muted: false,
    rating: 5,
    messages: [
      { id: "m1", fromMe: false, text: "Oi! Vi seu anúncio do teclado.", time: "09:12" },
      { id: "m2", fromMe: true, text: "Oi Ana! Sim, está disponível.", time: "09:13" },
      { id: "m3", fromMe: false, text: "Combinado! Posso amanhã à tarde.", time: "09:20" },
    ],
  },
  {
    id: "2",
    name: "Carlos Lima",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Você aceita troca por fone?",
    unread: 0,
    muted: true,
    rating: 4,
    messages: [
      { id: "m1", fromMe: false, text: "Você aceita troca por fone?", time: "Ontem" },
    ],
  },
  {
    id: "3",
    name: "Marina P.",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Obrigada!", 
    unread: 0,
    muted: false,
    rating: 5,
    messages: [
      { id: "m1", fromMe: true, text: "Enviei as fotos. O que achou?", time: "Qua" },
      { id: "m2", fromMe: false, text: "Obrigada!", time: "Qua" },
    ],
  },
];

export default function Chat() {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string>(mockConversations[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [conversations]);

  // Simulação de presença online dinâmica
  useEffect(() => {
    const int = setInterval(() => setIsOnline((o) => !o), 15000);
    return () => clearInterval(int);
  }, []);

  // No mobile, iniciar na lista (sem conversa ativa)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setActiveId("");
    }
  }, []);

  // Simulação do indicador "digitando..." quando o usuário digita
  useEffect(() => {
    if (!message.trim()) {
      setIsTyping(false);
      return;
    }
    setIsTyping(true);
    const to = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(to);
  }, [message]);

  const sendMessage = () => {
    if ((!message.trim() && pendingAttachments.length === 0) || !active) return;
    const newMsg: Message = {
      id: Math.random().toString(36).slice(2),
      fromMe: true,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachments: pendingAttachments.length ? pendingAttachments : undefined,
    };
    setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text || (newMsg.attachments?.length ? t('attachments') : c.lastMessage), unread: 0 } : c)));
    setMessage("");
    setPendingAttachments([]);
  };

  const toggleMute = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, muted: !c.muted } : c)));
  };

  const blockUser = (id: string) => {
    // Simples: remove a conversa da lista
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(prev => (prev === id ? prev : prev));
  };

  const rateUser = (id: string, stars: number) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, rating: stars } : c)));
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(prev => (prev === id ? (prev && prev) : prev));
  };

  const togglePin = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  };

  const markUnread = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: (c.unread ?? 0) + 1 } : c)));
  };

  const markRead = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const atts: Attachment[] = Array.from(files).slice(0, 6).map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      type: f.type,
    }));
    setPendingAttachments((prev) => [...prev, ...atts].slice(0, 6));
  };

  return (
    <div className="min-h-screen pb-20">
      <Header title={t('matchesTitle') || 'Matches'} showLanguageSelector showNotifications />

      {/* Mobile: mostrar lista OU conversa em tela cheia */}
      <div className="pt-16 lg:hidden max-w-7xl mx-auto px-4">
        {!activeId ? (
          <Card className="border-border/60 overflow-hidden">
            <div className="p-3 flex items-center gap-2">
              <Input placeholder={t('searchConversation') || 'Buscar conversa'} />
              <Button variant="secondary" size="icon" className="shrink-0"><MessageSquarePlus className="w-4 h-4" /></Button>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="p-2 space-y-1">
                {sortedConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left hover:bg-muted/50`}
                  >
                    <Avatar>
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback>{c.name.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{c.name}</p>
                        {c.rating ? (
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span className="ml-1 text-xs">{c.rating.toFixed(0)}</span>
                          </div>
                        ) : null}
                        {c.pinned ? (
                          <Badge className="ml-auto flex items-center gap-1"><Pin className="w-3 h-3" />{t('pinned') || 'Fixado'}</Badge>
                        ) : c.muted ? (
                          <Badge variant="secondary" className="ml-auto flex items-center gap-1"><BellOff className="w-3 h-3" />{t('muted') || 'Silenciado'}</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread ? (
                      <Badge className="ml-2">{c.unread}</Badge>
                    ) : null}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        ) : (
          <Card className="border-border/60 overflow-hidden">
            <div className="flex flex-col h-[calc(100vh-160px)]">
              {/* Header chat com Voltar */}
              <div className="p-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setActiveId("")}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={active?.avatar} alt={active?.name} />
                    <AvatarFallback>{active?.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold leading-tight">{active?.name}</p>
                    <p className="text-xs text-muted-foreground">{isTyping ? t('typing') || 'digitando...' : isOnline ? t('onlineNow') || 'Online agora' : t('offline') || 'Offline'}</p>
                  </div>
                </div>
                <div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>{t('actions') || 'Ações'}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        {active && (
                          <ProfileActions
                            name={active.name}
                            onMute={() => toggleMute(active.id)}
                            muted={!!active.muted}
                            onBlock={() => blockUser(active.id)}
                            onRate={(n) => rateUser(active.id, n)}
                          />
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Mensagens */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {active?.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        m.fromMe ? "bg-gradient-primary text-white" : "bg-muted"
                      }`}>
                        {m.text && <p>{m.text}</p>}
                        {m.attachments && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {m.attachments.map((a, idx) => (
                              <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="block group">
                                <div className="aspect-video rounded-md overflow-hidden border border-border/50 bg-background">
                                  {a.type.startsWith('image/') ? (
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    <img src={a.url} className="object-cover w-full h-full" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                      <ImageIcon className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-[11px] mt-1 truncate opacity-90 group-hover:underline">{a.name}</p>
                              </a>
                            ))}
                          </div>
                        )}
                        <p className={`text-[10px] mt-1 ${m.fromMe ? "text-white/80" : "text-muted-foreground"}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => onPickFiles(e.target.files)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('writeMessage') || 'Escreva uma mensagem...'}
                  rows={1}
                  className="resize-none"
                />
                <Button onClick={sendMessage} className="bg-gradient-primary text-white" disabled={!message.trim() && pendingAttachments.length === 0}>
                  <Send className="w-4 h-4 mr-1" /> {t('send') || 'Enviar'}
                </Button>
              </div>

              {pendingAttachments.length > 0 && (
                <div className="px-3 pb-3">
                  <div className="text-xs text-muted-foreground mb-1">{t('attachments') || 'Anexos'} ({pendingAttachments.length})</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {pendingAttachments.map((a, i) => (
                      <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                        {a.type.startsWith('image/') ? (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img src={a.url} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Desktop: layout em duas colunas */}
      <div className="pt-16 hidden lg:grid grid-cols-12 gap-4 max-w-7xl mx-auto px-4">
        {/* Sidebar conversas */}
        <Card className="col-span-4 border-border/60 overflow-hidden">
          <div className="p-3 flex items-center gap-2">
            <Input placeholder={t('searchConversation') || 'Buscar conversa'} />
            <Button variant="secondary" size="icon" className="shrink-0"><MessageSquarePlus className="w-4 h-4" /></Button>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-2 space-y-1">
              {sortedConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    activeId === c.id ? "bg-accent" : "hover:bg-muted/50"
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={c.avatar} alt={c.name} />
                    <AvatarFallback>{c.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{c.name}</p>
                      {c.rating ? (
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span className="ml-1 text-xs">{c.rating.toFixed(0)}</span>
                        </div>
                      ) : null}
                      {c.pinned ? (
                        <Badge className="ml-auto flex items-center gap-1"><Pin className="w-3 h-3" />{t('pinned') || 'Fixado'}</Badge>
                      ) : c.muted ? (
                        <Badge variant="secondary" className="ml-auto flex items-center gap-1"><BellOff className="w-3 h-3" />{t('muted') || 'Silenciado'}</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread ? (
                    <Badge className="ml-2">{c.unread}</Badge>
                  ) : null}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePin(c.id); }}>
                        <Pin className="w-4 h-4 mr-2" /> {t('pinConversation') || 'Fixar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); markUnread(c.id); }}>
                        <Badge className="w-4 h-4 mr-2 flex items-center justify-center"><span className="text-[10px]">•</span></Badge> {t('markAsUnread') || 'Marcar como não lida'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); markRead(c.id); }}>
                        <CheckCheck className="w-4 h-4 mr-2" /> {t('markAsRead') || 'Marcar como lida'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}>
                        <Trash2 className="w-4 h-4 mr-2" /> {t('deleteConversation') || 'Excluir conversa'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Janela de chat */}
        <Card className="col-span-8 border-border/60 overflow-hidden">
          {!active ? (
            <div className="h-[60vh] flex items-center justify-center text-muted-foreground">Selecione uma conversa</div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-160px)]">
              {/* Header chat */}
              <div className="p-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  {/* back no desktop fica oculto */}
                  <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={() => setActiveId("")}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={active.avatar} alt={active.name} />
                    <AvatarFallback>{active.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold leading-tight">{active.name}</p>
                    <p className="text-xs text-muted-foreground">{isTyping ? t('typing') || 'digitando...' : isOnline ? t('onlineNow') || 'Online agora' : t('offline') || 'Offline'}</p>
                  </div>
                </div>

                {/* Ações rápidas desktop */}
                <div className="hidden sm:flex items-center gap-2">
                  <ProfileActions
                    name={active.name}
                    onMute={() => toggleMute(active.id)}
                    muted={!!active.muted}
                    onBlock={() => blockUser(active.id)}
                    onRate={(n) => rateUser(active.id, n)}
                  />
                </div>

                {/* Ações mobile em Sheet */}
                <div className="sm:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>{t('actions') || 'Ações'}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        <ProfileActions
                          name={active.name}
                          onMute={() => toggleMute(active.id)}
                          muted={!!active.muted}
                          onBlock={() => blockUser(active.id)}
                          onRate={(n) => rateUser(active.id, n)}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Mensagens */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {active.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        m.fromMe ? "bg-gradient-primary text-white" : "bg-muted"
                      }`}>
                        {m.text && <p>{m.text}</p>}
                        {m.attachments && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {m.attachments.map((a, idx) => (
                              <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="block group">
                                <div className="aspect-video rounded-md overflow-hidden border border-border/50 bg-background">
                                  {a.type.startsWith('image/') ? (
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    <img src={a.url} className="object-cover w-full h-full" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                      <ImageIcon className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-[11px] mt-1 truncate opacity-90 group-hover:underline">{a.name}</p>
                              </a>
                            ))}
                          </div>
                        )}
                        <p className={`text-[10px] mt-1 ${m.fromMe ? "text-white/80" : "text-muted-foreground"}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => onPickFiles(e.target.files)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('writeMessage') || 'Escreva uma mensagem...'}
                  rows={1}
                  className="resize-none"
                />
                <Button onClick={sendMessage} className="bg-gradient-primary text-white" disabled={!message.trim() && pendingAttachments.length === 0}>
                  <Send className="w-4 h-4 mr-1" /> {t('send') || 'Enviar'}
                </Button>
              </div>

              {pendingAttachments.length > 0 && (
                <div className="px-3 pb-3">
                  <div className="text-xs text-muted-foreground mb-1">{t('attachments') || 'Anexos'} ({pendingAttachments.length})</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {pendingAttachments.map((a, i) => (
                      <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                        {a.type.startsWith('image/') ? (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img src={a.url} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ProfileActions({ name, muted, onMute, onBlock, onRate }: { name: string; muted: boolean; onMute: () => void; onBlock: () => void; onRate: (n: number) => void; }) {
  const [openBlock, setOpenBlock] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [rating, setRating] = useState(0);
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {/* Ver perfil */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm"><Eye className="w-4 h-4 mr-1" /> {t('viewProfile') || 'Ver perfil'}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profileOf', { name }) || `Perfil de ${name}`}</DialogTitle>
            <DialogDescription>{t('publicInfoAndRatings') || 'Informações públicas e avaliações do usuário.'}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 mt-2">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${name}`} />
              <AvatarFallback>{name.slice(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
              <div className="flex items-center text-amber-500">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-amber-500" : ""}`} onClick={() => setRating(i)} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t('memberSinceTrades', { year: '2022', trades: '15' }) || 'Membro desde 2022 • 15 trocas'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenProfile(false)}>{t('close') || 'Fechar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Silenciar */}
      <Button variant="outline" size="sm" onClick={onMute}>
        {muted ? <Bell className="w-4 h-4 mr-1" /> : <BellOff className="w-4 h-4 mr-1" />} {muted ? (t('unmute') || 'Ativar') : (t('mute') || 'Silenciar')}
      </Button>

      {/* Mais ações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('actions') || 'Ações'}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenReport(true)}>
            <ShieldAlert className="w-4 h-4 mr-2 text-destructive" /> {t('report') || 'Denunciar'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenBlock(true)}>
            <XCircle className="w-4 h-4 mr-2" /> {t('block') || 'Bloquear'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onRate(5)}>
            <Star className="w-4 h-4 mr-2" /> {t('rateFive') || 'Avaliar 5 estrelas'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogo bloquear */}
      <Dialog open={openBlock} onOpenChange={setOpenBlock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('blockConfirmTitle', { name }) || `Bloquear ${name}?`}</DialogTitle>
            <DialogDescription>{t('blockConfirmDesc') || 'Você não receberá mais mensagens deste usuário.'}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenBlock(false)}>{t('cancel') || 'Cancelar'}</Button>
            <Button variant="destructive" onClick={() => { onBlock(); setOpenBlock(false); }}>{t('block') || 'Bloquear'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogo denunciar */}
      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('reportUserTitle', { name }) || `Denunciar ${name}`}</DialogTitle>
            <DialogDescription>{t('reportReason') || 'Descreva o motivo da denúncia.'}</DialogDescription>
          </DialogHeader>
          <Textarea placeholder={t('reportPlaceholder') || 'Conte o que aconteceu...'} rows={4} />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenReport(false)}>{t('cancel') || 'Cancelar'}</Button>
            <Button onClick={() => setOpenReport(false)}>{t('sendReport') || 'Enviar denúncia'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
