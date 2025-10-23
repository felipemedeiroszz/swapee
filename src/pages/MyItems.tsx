import { useState } from 'react';
import { Plus, Search, Filter, ArrowLeft, Pencil, Trash2, Check, X, LayoutGrid, List, MoreVertical, Eye, BarChart3, Power, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import '../styles/my-items.css';
import { listUserItems, updateItemStatus, removeItem, Item as ApiItem } from '@/services/items';

// Tipos UI
type Item = {
  id: string;
  title: string;
  image: string;
  type: 'Troca' | 'Doação' | 'Venda';
  status: string;
  date?: string;
  views?: number;
  matches?: number;
};

// Helpers de mapeamento
function mapApiItemToUi(item: ApiItem): Item {
  const typeMap: Record<ApiItem['tipo'], Item['type']> = {
    troca: 'Troca',
    doacao: 'Doação',
    venda: 'Venda',
  };
  const statusMap: Record<NonNullable<ApiItem['status']>, string> = {
    ativo: 'Disponível',
    pendente: 'Em Análise',
    inativo: 'Inativo',
    vendido: 'Vendido',
    trocado: 'Trocado',
  };
  return {
    id: item.id,
    title: item.titulo,
    image: item.imagens?.[0] || 'https://via.placeholder.com/300x300?text=Item',
    type: typeMap[item.tipo],
    status: item.status ? statusMap[item.status] : 'Disponível',
    date: item.createdAt,
    views: item.visualizacoes,
    matches: item.matches,
  };
}

const MyItems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'inactive'>('active');
  const [items, setItems] = useState<{ active: Item[]; pending: Item[]; inactive: Item[] }>({ active: [], pending: [], inactive: [] });
  const [editing, setEditing] = useState<{ [key: string]: { title: string; type: Item['type'] } }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recentes' | 'popularidade' | 'visualizacoes'>('recentes');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('swapee-user-id');
    if (!userId) {
      toast.error('Usuário não identificado');
      return;
    }
    setLoading(true);
    listUserItems(userId, { page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'DESC' })
      .then((res) => {
        const uiItems = res.items.map(mapApiItemToUi);
        const active = uiItems.filter((it) => it.status === 'Disponível');
        const pending = uiItems.filter((it) => it.status === 'Em Análise');
        const inactive = uiItems.filter((it) => ['Inativo', 'Vendido', 'Trocado'].includes(it.status));
        setItems({ active, pending, inactive });
      })
      .catch((e) => {
        toast.error(typeof e?.message === 'string' ? e.message : 'Falha ao carregar itens');
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'default';
      case 'Match!':
        return 'secondary';
      case 'Em Análise':
        return 'outline';
      case 'Vendido':
      case 'Inativo':
      case 'Trocado':
        return 'outline';
      default:
        return 'default';
    }
  };

  type SectionProps = {
    value: 'active' | 'pending' | 'inactive';
    items: Item[];
    viewMode: 'grid' | 'list';
    editing: { [key: string]: { title: string; type: Item['type'] } };
    onStartEdit: (item: Item) => void;
    onCancelEdit: (id: string) => void;
    onSaveEdit: (id: string) => void;
    onCloseItem: (id: string) => void;
    onDeleteItem: (id: string) => void;
    getTypeVariant: (type: string) => any;
    getStatusVariant: (status: string) => any;
  };

  const Section = ({ value, items, viewMode, editing, onStartEdit, onCancelEdit, onSaveEdit, onCloseItem, onDeleteItem, getTypeVariant, getStatusVariant }: SectionProps) => (
    <TabsContent value={value}>
      {items.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'grid gap-4'}>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              isEditing={!!editing[item.id]}
              editTitle={editing[item.id]?.title}
              editType={editing[item.id]?.type}
              onChangeTitle={(t) => onStartEdit({ ...item, title: t })}
              onChangeType={(t) => onStartEdit({ ...item, type: t as Item['type'] })}
              onStartEdit={() => onStartEdit(item)}
              onCancelEdit={() => onCancelEdit(item.id)}
              onSaveEdit={() => onSaveEdit(item.id)}
              onClose={() => onCloseItem(item.id)}
              onDelete={() => onDeleteItem(item.id)}
              getTypeVariant={getTypeVariant}
              getStatusVariant={getStatusVariant}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state text-center py-12">
          <p className="text-muted-foreground">Nenhum item encontrado nesta categoria</p>
          <Button className="mt-4" onClick={() => navigate('/adicionar-item')}>
            <Plus className="w-4 h-4 mr-2" />
            Criar novo anúncio
          </Button>
        </div>
      )}
    </TabsContent>
  );

  type ItemCardProps = {
    item: Item;
    viewMode: 'grid' | 'list';
    isEditing: boolean;
    editTitle?: string;
    editType?: Item['type'];
    onChangeTitle: (v: string) => void;
    onChangeType: (v: string) => void;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    onClose: () => void;
    onDelete: () => void;
    getTypeVariant: (type: string) => any;
    getStatusVariant: (status: string) => any;
  };

  const ItemCard = ({ item, viewMode, isEditing, editTitle, editType, onChangeTitle, onChangeType, onStartEdit, onCancelEdit, onSaveEdit, onClose, onDelete, getTypeVariant, getStatusVariant }: ItemCardProps) => {
    const [idx, setIdx] = useState(0);
    const images = [item.image, item.image + '&v=2', item.image + '&v=3'];
    const isGrid = viewMode === 'grid';

    const content = (
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <Input value={editTitle ?? item.title} onChange={(e) => onChangeTitle(e.target.value)} className="max-w-[60%] h-8" />
          ) : (
            <h3 className="font-semibold text-foreground">{item.title}</h3>
          )}
          <span className={`status-badge ${item.status === 'Em Análise' ? 'pending' : item.status === 'Disponível' || item.status === 'Match!' ? 'active' : 'closed'}`}>{item.status}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {isEditing ? (
            <select className="h-8 rounded-md border bg-background/50 px-2 text-sm" value={editType ?? item.type} onChange={(e) => onChangeType(e.target.value)}>
              <option value="Troca">Troca</option>
              <option value="Doação">Doação</option>
              <option value="Venda">Venda</option>
            </select>
          ) : (
            <Badge variant={getTypeVariant(item.type)} className="text-xs">{item.type}</Badge>
          )}
          <div className="text-sm text-muted-foreground">{item.date}{item.views !== undefined ? ` • ${item.views} visualizações` : ''}{item.matches !== undefined ? ` • ${item.matches} matches` : ''}</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <Button variant="default" size="sm" className="text-xs gap-1" onClick={onSaveEdit}><Check className="w-3.5 h-3.5" /> Salvar</Button>
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={onCancelEdit}><X className="w-3.5 h-3.5" /> Cancelar</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={onStartEdit}><Pencil className="w-3.5 h-3.5" /> Editar</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs gap-1"><MoreVertical className="w-3.5 h-3.5" /> Ações</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4" /> Visualizar</DropdownMenuItem>
                  <DropdownMenuItem className="gap-2"><BarChart3 className="w-4 h-4" /> Estatísticas</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-full text-left px-2 py-1.5 hover:bg-destructive/10 text-destructive inline-flex items-center gap-2"><Power className="w-4 h-4" /> Encerrar</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Encerrar anúncio?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação retirará o item dos resultados de busca.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={onClose}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="text-xs gap-1"><Trash2 className="w-3.5 h-3.5" /> Excluir</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir "{item.title}"?</AlertDialogTitle>
                    <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    );

    return (
      <Card className={`item-card overflow-hidden ${!isGrid ? 'flex' : ''}`}>
        {/* Imagem/Carousel */}
        <div className={`${isGrid ? 'h-40' : 'w-32 h-32 flex-shrink-0'} carousel bg-black/5 relative`}>
          <div className="carousel-track" style={{ transform: `translateX(-${idx * 100}%)`, width: `${images.length * 100}%` }}>
            {images.map((src, i) => (
              <img key={i} src={src} alt={item.title} className="object-cover w-full h-full" style={{ width: `${100 / images.length}%` }} />
            ))}
          </div>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} className={`carousel-dot ${idx === i ? 'active' : ''}`} onClick={() => setIdx(i)} aria-label={`slide ${i+1}`} />
            ))}
          </div>
        </div>
        {content}
      </Card>
    );
  };

  const getTypeVariant = (type: string) => {
    return type === 'Doação' ? 'secondary' : 'default';
  };

  const filteredItems = {
    active: items.active.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    pending: items.pending.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    inactive: items.inactive.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  const startEdit = (item: Item) => {
    setEditing(prev => ({ ...prev, [item.id]: { title: item.title, type: item.type } }));
  };

  const cancelEdit = (id: string) => {
    setEditing(prev => {
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
  };

  const saveEdit = (tab: keyof typeof items, id: string) => {
    const data = editing[id];
    if (!data) return;
    setItems(prev => ({
      ...prev,
      [tab]: prev[tab].map(it => it.id === id ? { ...it, title: data.title, type: data.type } : it)
    }));
    cancelEdit(id);
    toast.success('Item atualizado');
  };

  const closeItem = async (tab: keyof typeof items, id: string) => {
    try {
      const userId = localStorage.getItem('swapee-user-id');
      if (!userId) throw new Error('Usuário não identificado');
      await updateItemStatus(id, 'inativo');
      const item = items[tab].find(i => i.id === id);
      if (!item) return;
      const moved = { ...item, status: 'Inativo' };
      setItems(prev => ({
        active: prev.active.filter(i => i.id !== id),
        pending: prev.pending.filter(i => i.id !== id),
        inactive: [moved, ...prev.inactive]
      }));
      toast.success('Anúncio encerrado');
    } catch (e: any) {
      toast.error(typeof e?.message === 'string' ? e.message : 'Falha ao encerrar');
    }
  };

  const deleteItem = async (tab: keyof typeof items, id: string) => {
    try {
      await removeItem(id);
      setItems(prev => ({
        ...prev,
        [tab]: prev[tab].filter(i => i.id !== id)
      }));
      toast.success('Item excluído');
    } catch (e: any) {
      toast.error(typeof e?.message === 'string' ? e.message : 'Falha ao excluir');
    }
  };

  const sortItems = (list: Item[]) => {
    switch (sortBy) {
      case 'popularidade':
        return [...list].sort((a, b) => (b.matches ?? 0) - (a.matches ?? 0));
      case 'visualizacoes':
        return [...list].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      default:
        return list; // mantém ordem
    }
  };

  return (
    <div className="min-h-screen dashboard-shell">
      <Header
        title="Meus Itens"
        leftIcon={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-accent/50">
              <ArrowLeft className="w-5 h-5" />
            </button>
            {/* Mobile Sidebar */}
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full hover:bg-accent/50 lg:hidden">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="dashboard-sidebar w-72">
                <SheetHeader>
                  <SheetTitle className="text-pink-700">Navegação</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 space-y-1">
                  <a className="nav-item active" href="#">Meus Itens</a>
                  <a className="nav-item" href="#">Sobre</a>
                  <a className="nav-item" href="#">Estatísticas</a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        }
      />

      <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block dashboard-sidebar rounded-xl p-4 h-max">
          <nav className="space-y-1">
            <button className="nav-item active w-full text-left">Meus Itens</button>
            <button className="nav-item w-full text-left">Sobre</button>
            <button className="nav-item w-full text-left">Estatísticas</button>
          </nav>
          <div className="mt-6 space-y-3">
            <div className="metrics-card p-4">
              <div className="text-sm text-muted-foreground">Visualizações (7 dias)</div>
              <div className="mt-2 text-2xl font-semibold">312</div>
              <Progress value={68} className="mt-3" />
            </div>
            <div className="metrics-card p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Matches</div>
                <BarChart3 className="w-4 h-4 text-pink-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold">12</div>
              <Progress value={42} className="mt-3" />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main>
          {/* Top controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar meus itens..."
                className="pl-10 bg-white/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full md:w-56 bg-white/70">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recentes">Mais recentes</SelectItem>
                <SelectItem value="popularidade">Popularidade</SelectItem>
                <SelectItem value="visualizacoes">Visualizações</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <div className="grid-toggle inline-flex rounded-md border bg-white/70">
              <button className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-pink-100 text-pink-700' : 'text-muted-foreground'}`} onClick={() => setViewMode('grid')}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className={`px-3 py-2 ${viewMode === 'list' ? 'bg-pink-100 text-pink-700' : 'text-muted-foreground'}`} onClick={() => setViewMode('list')}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button className="gap-2" onClick={() => navigate('/adicionar-item')}>
              <Plus className="w-4 h-4" />
              Novo Anúncio
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="active">Ativos ({items.active.length})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({items.pending.length})</TabsTrigger>
              <TabsTrigger value="inactive">Encerrados ({items.inactive.length})</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Section value="active" items={sortItems(filteredItems.active)} viewMode={viewMode} onStartEdit={startEdit} onCancelEdit={cancelEdit} onSaveEdit={(id) => saveEdit('active', id)} editing={editing} getTypeVariant={getTypeVariant} getStatusVariant={getStatusVariant} onCloseItem={(id) => closeItem('active', id)} onDeleteItem={(id) => deleteItem('active', id)} />
              <Section value="pending" items={sortItems(filteredItems.pending)} viewMode={viewMode} onStartEdit={startEdit} onCancelEdit={cancelEdit} onSaveEdit={() => {}} editing={editing} getTypeVariant={getTypeVariant} getStatusVariant={getStatusVariant} onCloseItem={(id) => closeItem('pending', id)} onDeleteItem={(id) => deleteItem('pending', id)} />
              <Section value="inactive" items={sortItems(filteredItems.inactive)} viewMode={viewMode} onStartEdit={startEdit} onCancelEdit={cancelEdit} onSaveEdit={() => {}} editing={editing} getTypeVariant={getTypeVariant} getStatusVariant={getStatusVariant} onCloseItem={() => {}} onDeleteItem={(id) => deleteItem('inactive', id)} />
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MyItems;
