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
import { Star, Bell, BellOff, MoreVertical, Send, ShieldAlert, Eye, XCircle, MessageSquarePlus, Paperclip, Trash2, Pin, CheckCheck, Check, Image as ImageIcon, ArrowLeft, Search, LockKeyhole, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import "../styles/chat.css";

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
  const [tab, setTab] = useState<'all'|'unread'|'pinned'|'muted'>('all');
  // Donation verification state
  const [openGenCode, setOpenGenCode] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [verifiedMap, setVerifiedMap] = useState<Record<string, { code: string; verified: boolean }>>(() => {
    try {
      return JSON.parse(localStorage.getItem('swapee-donation-codes') || '{}');
    } catch {
      return {};
    }
  });
  // Conversation type per conversation: 'Doação' | 'Troca'
  const [convTypeMap, setConvTypeMap] = useState<Record<string, 'Doação'|'Troca'>>(() => {
    try {
      return JSON.parse(localStorage.getItem('swapee-conv-type') || '{}');
    } catch {
      return {} as Record<string, 'Doação'|'Troca'>;
    }
  });
  // Lock conversation type (from navigation context) per conversation
  const [lockTypeMap, setLockTypeMap] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('swapee-conv-type-lock') || '{}');
    } catch {
      return {} as Record<string, boolean>;
    }
  });
  // Rating after exchange
  const [openRate, setOpenRate] = useState(false);
  const [ratingValue, setRatingValue] = useState<number>(0);

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);
  const sortedConversations = useMemo(() => {
    let list = [...conversations];
    if (tab === 'unread') list = list.filter(c => (c.unread ?? 0) > 0);
    if (tab === 'pinned') list = list.filter(c => c.pinned);
    if (tab === 'muted') list = list.filter(c => c.muted);
    return list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [conversations, tab]);

  const isUserOnline = (id: string) => {
    // demo presence: alternate + global toggle for movement
    const n = parseInt(id, 10);
    return ((n % 2) === 1) ? isOnline : !isOnline;
  };

  // Simulação de presença online dinâmica
  useEffect(() => {
    const int = setInterval(() => setIsOnline((o) => !o), 15000);
    return () => clearInterval(int);
  }, []);

  // Persist verifiedMap changes
  useEffect(() => {
    localStorage.setItem('swapee-donation-codes', JSON.stringify(verifiedMap));
  }, [verifiedMap]);

  // Persist convTypeMap changes
  useEffect(() => {
    localStorage.setItem('swapee-conv-type', JSON.stringify(convTypeMap));
  }, [convTypeMap]);

  // Persist lockTypeMap changes
  useEffect(() => {
    localStorage.setItem('swapee-conv-type-lock', JSON.stringify(lockTypeMap));
  }, [lockTypeMap]);

  // Apply defaults from navigation: swapee-default-conv-type & swapee-lock-type
  useEffect(() => {
    if (!active) return;
    const def = localStorage.getItem('swapee-default-conv-type') as 'Doação'|'Troca' | null;
    const lock = localStorage.getItem('swapee-lock-type');
    if (def) {
      setConvTypeMap(prev => ({ ...prev, [active.id]: def }));
      localStorage.removeItem('swapee-default-conv-type');
    }
    if (lock === '1') {
      setLockTypeMap(prev => ({ ...prev, [active.id]: true }));
      localStorage.removeItem('swapee-lock-type');
    }
  }, [active?.id]);

  const generateSixDigit = () => Math.floor(100000 + Math.random() * 900000).toString();

  const onGenerateCode = () => {
    if (!active) return;
    const entry = verifiedMap[active.id];
    // If there is a pending (unverified) code, just show it instead of generating a new one
    if (entry && !entry.verified) {
      setGeneratedCode(entry.code);
      setOpenGenCode(true);
      toast.message('Já existe um código pendente para esta conversa.');
      return;
    }
    // Otherwise, generate a new one
    const code = generateSixDigit();
    setVerifiedMap(prev => ({ ...prev, [active.id]: { code, verified: false } }));
    setGeneratedCode(code);
    setOpenGenCode(true);
  };

  const onVerifyDelivery = () => {
    if (!active) return;
    const entry = verifiedMap[active.id];
    if (!entry) {
      toast.error('Nenhum código foi gerado para esta conversa.');
      return;
    }
    if (verifyCode === entry.code) {
      if (!entry.verified) {
        // mark verified and award coins
        const newMap = { ...verifiedMap, [active.id]: { code: entry.code, verified: true } };
        setVerifiedMap(newMap);
        const type = convTypeMap[active.id] || 'Doação';
        if (type === 'Doação') {
          const currentCoins = parseInt(localStorage.getItem('swapee-coins') || '0', 10) || 0;
          localStorage.setItem('swapee-coins', String(currentCoins + 100));
          const currentDonations = parseInt(localStorage.getItem('swapee-donations') || '0', 10) || 0;
          localStorage.setItem('swapee-donations', String(currentDonations + 1));
          // append system message
          const sysMsg: Message = {
            id: Math.random().toString(36).slice(2),
            fromMe: false,
            text: 'Doação confirmada ✅',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, sysMsg], lastMessage: sysMsg.text } : c));
          toast.success('Entrega verificada! +100 coins');
        } else {
          // Troca: no coins; open rating dialog
          const sysMsg: Message = {
            id: Math.random().toString(36).slice(2),
            fromMe: false,
            text: 'Troca confirmada 🔄',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, sysMsg], lastMessage: sysMsg.text } : c));
          setOpenRate(true);
          toast.success('Troca verificada! Avalie a outra pessoa.');
        }
      } else {
        toast.message('Entrega já havia sido verificada.');
      }
      setOpenVerify(false);
      setVerifyCode("");
    } else {
      toast.error('Código inválido. Tente novamente.');
    }
  };

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
    <div className="min-h-screen pb-20 chat-shell">
      <Header title={t('matchesTitle') || 'Matches'} showLanguageSelector showNotifications />

      {/* Mobile: mostrar lista OU conversa em tela cheia */}
      <div className="pt-16 lg:hidden max-w-7xl mx-auto px-4">
        {!activeId ? (
          <Card className="border-border/60 overflow-hidden bg-gradient-card">
            <div className="p-3 flex flex-col gap-2">
              <div className="searchbar">
                <Search className="icon w-4 h-4" />
                <input placeholder={"Search conversation"} aria-label={t('searchConversation') || 'Buscar conversa'} />
                <Button variant="secondary" size="icon" className="shrink-0"><MessageSquarePlus className="w-4 h-4" /></Button>
              </div>
              <div className="tabbar overflow-auto">
                <button className={`tab ${tab==='all'?'active':''}`} onClick={()=>setTab('all')}>{t('tabAll')}</button>
                <button className={`tab ${tab==='unread'?'active':''}`} onClick={()=>setTab('unread')}>{t('tabUnread')}</button>
                <button className={`tab ${tab==='pinned'?'active':''}`} onClick={()=>setTab('pinned')}>{t('tabPinned')}</button>
                <button className={`tab ${tab==='muted'?'active':''}`} onClick={()=>setTab('muted')}>{t('tabMuted')}</button>
              </div>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="p-2 space-y-1">
                {sortedConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full chat-item ${activeId===c.id?'active':''} text-left`}
                  >
                    <div className="avatar-wrap">
                      <Avatar>
                        <AvatarImage src={c.avatar} alt={c.name} />
                        <AvatarFallback>{c.name.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className={`status-dot ${isUserOnline(c.id)?'online':'offline'}`} />
                    </div>
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate flex-1">{c.lastMessage}</span>
                        <span className="text-xs whitespace-nowrap opacity-70">{c.messages[c.messages.length-1]?.time}</span>
                      </div>
                    </div>
                    {c.unread ? (
                      <span className="unread-badge ml-2">{c.unread}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        ) : (
          <Card className="border-border/60 overflow-hidden bg-gradient-card">
            <div className="flex flex-col h-[calc(100vh-160px)]">
              {/* Header chat com Voltar */}
              <div className="p-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setActiveId("")}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={active?.avatar} alt={active?.name} />
                    <AvatarFallback>{active?.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold leading-tight">{active?.name}</p>
                    <div className="text-xs text-muted-foreground h-4 flex items-center">
                      {isTyping ? (
                        <span className="typing" aria-label={t('typing') || 'digitando...'}>
                          <span></span><span></span><span></span>
                        </span>
                      ) : (isOnline ? (t('onlineNow') || 'Online agora') : (t('offline') || 'Offline'))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Donation status indicator */}
                  {active && verifiedMap[active.id]?.verified && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-green-600 px-2 py-1 rounded-full bg-green-100">
                      <ShieldCheck className="w-3 h-3" /> Doação concluída
                    </span>
                  )}
                  {/* Conversation type badge and actions */}
                  {active && (
                    <>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${ (convTypeMap[active.id] || 'Doação') === 'Doação' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700' }`}>
                        {(convTypeMap[active.id] || 'Doação')}
                      </span>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                          <SheetHeader>
                            <SheetTitle>{t('actions') || 'Ações'}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4 space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={onGenerateCode}>
                              <LockKeyhole className="w-4 h-4" /> {(active && verifiedMap[active.id]?.verified===false) ? 'Mostrar código pendente' : 'Gerar código'}
                            </Button>
                            <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700" onClick={() => setOpenVerify(true)}>
                              <ShieldCheck className="w-4 h-4" /> Verificar entrega
                            </Button>
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
                    </>
                  )}
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
        <Card className="col-span-4 border-border/60 overflow-hidden bg-gradient-card">
          <div className="p-3 flex flex-col gap-2">
            <div className="searchbar">
              <Search className="icon w-4 h-4" />
              <input placeholder={"Search conversation"} aria-label={t('searchConversation') || 'Buscar conversa'} />
              <Button variant="secondary" size="icon" className="shrink-0"><MessageSquarePlus className="w-4 h-4" /></Button>
            </div>
            <div className="tabbar">
              <button className={`tab ${tab==='all'?'active':''}`} onClick={()=>setTab('all')}>{t('tabAll')}</button>
              <button className={`tab ${tab==='unread'?'active':''}`} onClick={()=>setTab('unread')}>{t('tabUnread')}</button>
              <button className={`tab ${tab==='pinned'?'active':''}`} onClick={()=>setTab('pinned')}>{t('tabPinned')}</button>
              <button className={`tab ${tab==='muted'?'active':''}`} onClick={()=>setTab('muted')}>{t('tabMuted')}</button>
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-220px)] lg:h-[calc(100vh-220px)]">
            <div className="p-2 space-y-1">
              {sortedConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full chat-item ${activeId===c.id?'active':''} text-left`}
                >
                  <div className="avatar-wrap">
                    <Avatar>
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback>{c.name.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className={`status-dot ${isUserOnline(c.id)?'online':'offline'}`} />
                  </div>
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate flex-1">{c.lastMessage}</span>
                      <span className="text-xs whitespace-nowrap opacity-70">{c.messages[c.messages.length-1]?.time}</span>
                    </div>
                  </div>
                  {c.unread ? (
                    <span className="unread-badge ml-2">{c.unread}</span>
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

                {/* Ações (desktop): badge + 3 pontinhos */}
                <div className="hidden sm:flex items-center gap-2">
                  {active && verifiedMap[active.id]?.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 px-2 py-1 rounded-full bg-green-100">
                      <ShieldCheck className="w-3 h-3" /> Doação concluída
                    </span>
                  )}
                  {active && (
                    <>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${ (convTypeMap[active.id] || 'Doação') === 'Doação' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700' }`}>
                        {(convTypeMap[active.id] || 'Doação')}
                      </span>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                          <SheetHeader>
                            <SheetTitle>{t('actions') || 'Ações'}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4 space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={onGenerateCode}>
                              <LockKeyhole className="w-4 h-4" /> {(active && verifiedMap[active.id]?.verified===false) ? 'Mostrar código pendente' : 'Gerar código'}
                            </Button>
                            <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700" onClick={() => setOpenVerify(true)}>
                              <ShieldCheck className="w-4 h-4" /> Verificar entrega
                            </Button>
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
                    </>
                  )}
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
                  {active.messages.map((m, idx) => {
                    const isLast = idx === active.messages.length - 1;
                    return (
                    <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                      <div className={`msg ${m.fromMe ? 'me' : 'other'} text-sm`}>
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
                        <div className={`msg-meta ${m.fromMe ? "text-white/80" : "text-muted-foreground"}`}>
                          <span>{m.time}</span>
                          {m.fromMe && (
                            <span className={`msg-status ${isLast ? 'read' : ''}`}>
                              {isLast ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
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
    {/* Dialog: Generated Code */}
    <Dialog open={openGenCode} onOpenChange={setOpenGenCode}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Código de confirmação</DialogTitle>
          <DialogDescription>Compartilhe este código de 6 dígitos com quem irá receber a doação.</DialogDescription>
        </DialogHeader>
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-widest">{generatedCode}</div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => { navigator.clipboard?.writeText(generatedCode); toast.success('Código copiado'); }}>Copiar código</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Dialog: Verify Delivery */}
    <Dialog open={openVerify} onOpenChange={setOpenVerify}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verificar entrega</DialogTitle>
          <DialogDescription>Digite o código de 6 dígitos recebido para confirmar a doação.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={verifyCode} onChange={setVerifyCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpenVerify(false)}>Cancelar</Button>
          <Button onClick={onVerifyDelivery} className="bg-green-600 hover:bg-green-700">Verificar</Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Dialog: Rate after exchange */}
    <Dialog open={openRate} onOpenChange={setOpenRate}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avalie a troca</DialogTitle>
          <DialogDescription>Como foi sua experiência com {active?.name}?</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-2 py-2">
          {[1,2,3,4,5].map((n) => (
            <button key={n} onClick={() => setRatingValue(n)} aria-label={`Dar ${n} estrela(s)`}>
              <Star className={`w-6 h-6 ${n <= ratingValue ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpenRate(false)}>Cancelar</Button>
          <Button onClick={() => {
            if (!active || ratingValue === 0) { toast.error('Selecione uma nota.'); return; }
            try {
              const raw = localStorage.getItem('swapee-user-ratings') || '{}';
              const data = JSON.parse(raw);
              const list = Array.isArray(data[active.name]) ? data[active.name] : [];
              list.push(ratingValue);
              data[active.name] = list;
              localStorage.setItem('swapee-user-ratings', JSON.stringify(data));
              toast.success('Avaliação enviada!');
              const sysMsg: Message = { id: Math.random().toString(36).slice(2), fromMe: true, text: `Avaliação enviada: ${ratingValue}⭐`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
              setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, sysMsg], lastMessage: sysMsg.text } : c));
              setOpenRate(false);
              setRatingValue(0);
            } catch {
              toast.error('Não foi possível salvar a avaliação.');
            }
          }}>Enviar</Button>
        </div>
      </DialogContent>
    </Dialog>
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
