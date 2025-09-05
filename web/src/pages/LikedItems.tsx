import { Heart, MessageCircle, ArrowLeft, Search, X, LayoutGrid, List, Share2, MoreVertical } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Header from '@/components/Header';
import '../styles/liked-items.css';

type LikedItem = {
  id: string;
  title: string;
  image: string;
  type: 'Troca' | 'Doação' | 'Venda';
  price: string | null;
  location: string;
  timeAgo: string;
  isMatched: boolean;
  liked: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  distanceKm?: number;
  user?: { name: string; rating: number; avatar: string };
};

// Dados de exemplo - em uma aplicação real, isso viria de uma API
const mockLikedItems: LikedItem[] = [
  {
    id: '1',
    title: 'Jaqueta de Couro',
    image: 'https://images.unsplash.com/photo-1551028719-00167d1f7aa4?w=300&h=300&fit=crop',
    type: 'Troca',
    price: null,
    location: 'São Paulo, SP',
    timeAgo: '2 dias atrás',
    isMatched: true,
    liked: true,
    isPopular: true,
    distanceKm: 5,
    user: {
      name: 'Carlos',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    id: '2',
    title: 'Câmera Fotográfica',
    image: 'https://images.unsplash.com/photo-1526170375885-4edd8f8b1d2c?w=300&h=300&fit=crop',
    type: 'Venda',
    price: 'R$ 1.200',
    location: 'Rio de Janeiro, RJ',
    timeAgo: '1 semana atrás',
    isMatched: false,
    liked: true,
    isNew: true,
    distanceKm: 12,
    user: {
      name: 'Ana',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    id: '3',
    title: 'Livro: O Poder do Hábito',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
    type: 'Doação',
    price: null,
    location: 'Belo Horizonte, MG',
    timeAgo: '3 dias atrás',
    isMatched: false,
    liked: true,
    distanceKm: 2,
    user: {
      name: 'Pedro',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
  },
];

const LikedItems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<LikedItem[]>(mockLikedItems);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'data' | 'popularidade' | 'preco'>('data');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'Troca' | 'Doação' | 'Venda'>('todos');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [heartPulse, setHeartPulse] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, liked: !i.liked } : i));
    setHeartPulse(prev => new Set(prev).add(id));
    setTimeout(() => setHeartPulse(prev => { const n = new Set(prev); n.delete(id); return n; }), 450);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds(new Set(ids));
  };

  const bulkRemove = () => {
    if (selectedIds.size === 0) return;
    setItems(prev => prev.filter(i => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
    toast.success('Itens removidos da lista');
  };

  const filteredSorted = useMemo(() => {
    let list = items.filter(i =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (typeFilter !== 'todos') list = list.filter(i => i.type === typeFilter);
    if (onlyAvailable) list = list.filter(i => i.type !== 'Venda'); // exemplo: filtrar "disponível para troca"

    switch (sortBy) {
      case 'popularidade':
        list = [...list].sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
        break;
      case 'preco':
        list = [...list].sort((a, b) => {
          const pa = a.price ? Number(String(a.price).replace(/[^0-9]/g, '')) : Infinity;
          const pb = b.price ? Number(String(b.price).replace(/[^0-9]/g, '')) : Infinity;
          return pa - pb;
        });
        break;
      default:
        break; // por data (mock)
    }
    return list;
  }, [items, searchTerm, typeFilter, onlyAvailable, sortBy]);

  return (
    <div className="min-h-screen wishlist-shell">
      <Header
        title="Itens Curtidos"
        leftIcon={
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-accent/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      />

      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Itens Curtidos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Toolbar */}
        <div className="wishlist-toolbar mb-6 grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="relative lg:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar itens curtidos..." className="pl-10 bg-white/70" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 lg:col-span-4">
            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger className="bg-white/70 w-full">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Troca">Troca</SelectItem>
                <SelectItem value="Doação">Doação</SelectItem>
                <SelectItem value="Venda">Venda</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="bg-white/70 w-full">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data">Mais recentes</SelectItem>
                <SelectItem value="popularidade">Popularidade</SelectItem>
                <SelectItem value="preco">Menor preço</SelectItem>
              </SelectContent>
            </Select>
            <Button variant={onlyAvailable ? 'default' : 'outline'} className="whitespace-nowrap" onClick={() => setOnlyAvailable(v => !v)}>
              Disponível p/ troca
            </Button>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-3 lg:col-span-3">
            <div className="inline-flex rounded-md border bg-white/70">
              <button className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-pink-100 text-pink-700' : 'text-muted-foreground'}`} onClick={() => setViewMode('grid')}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className={`px-3 py-2 ${viewMode === 'list' ? 'bg-pink-100 text-pink-700' : 'text-muted-foreground'}`} onClick={() => setViewMode('list')}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={selectedIds.size === 0}>Remover Selecionados ({selectedIds.size})</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover itens selecionados?</AlertDialogTitle>
                  <AlertDialogDescription>Você pode adicioná-los novamente futuramente.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={bulkRemove}>Remover</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Grid/List */}
        {filteredSorted.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' : 'grid gap-3'}>
              {filteredSorted.map((item) => (
                <WishlistCard key={item.id} item={item} viewMode={viewMode} selected={selectedIds.has(item.id)} onToggleSelect={() => toggleSelect(item.id)} onToggleLike={() => toggleLike(item.id)} pulsing={heartPulse.has(item.id)} />
              ))}
            </div>
            {/* Bulk select helpers */}
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox id="selectAll" checked={selectedIds.size > 0 && selectedIds.size === filteredSorted.length} onCheckedChange={(c) => c ? selectAll(filteredSorted.map(i => i.id)) : setSelectedIds(new Set())} />
                <label htmlFor="selectAll">Selecionar tudo</label>
              </div>
              <span>{filteredSorted.length} itens</span>
            </div>
          </>
        ) : (
          <div className="empty-wishlist text-center py-16">
            <div className="mx-auto w-16 h-16 bg-white border rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum item curtido ainda</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Explore itens e toque no coração para adicionar à sua coleção favorita.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/')}>Explorar</Button>
              <Button variant="outline" onClick={() => setItems(mockLikedItems)}>Ver sugestões</Button>
            </div>
            {/* Sugestões simples */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 max-w-3xl mx-auto">
              {mockLikedItems.slice(0, 6).map(s => (
                <Card key={s.id} className="wishlist-card">
                  <div className="wishlist-image">
                    <img src={s.image} alt={s.title} loading="lazy" />
                  </div>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium truncate">{s.title}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{s.type}</Badge>
                      {s.price && <span className="text-xs font-semibold text-pink-700">{s.price}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default LikedItems;

type WishlistCardProps = {
  item: LikedItem;
  viewMode: 'grid' | 'list';
  selected: boolean;
  onToggleSelect: () => void;
  onToggleLike: () => void;
  pulsing: boolean;
};

const WishlistCard = ({ item, viewMode, selected, onToggleSelect, onToggleLike, pulsing }: WishlistCardProps) => {
  const isGrid = viewMode === 'grid';
  const badges = (
    <div className="flex flex-wrap gap-1">
      {item.isNew && <span className="badge-gold">Novo</span>}
      {item.isPopular && <span className="badge-coral">Popular</span>}
      {item.type === 'Troca' && <span className="badge-pink">Disponível p/ troca</span>}
    </div>
  );

  const image = (
    <div className={`wishlist-image ${!isGrid ? 'w-36 h-28 flex-shrink-0' : ''}`}>
      <img src={item.image} alt={item.title} loading="lazy" />
      <button className={`heart-btn ${item.liked ? 'liked' : ''} ${pulsing ? 'heart-pulse' : ''}`} onClick={onToggleLike} aria-label="Curtir">
        <Heart className="icon w-5 h-5" />
      </button>
      <div className="wishlist-overlay">
        <div className="flex items-center gap-2">
          <Checkbox checked={selected} onCheckedChange={() => onToggleSelect()} aria-label="Selecionar item" />
          {badges}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white/90">Ações</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2"><MessageCircle className="w-4 h-4" /> Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><Share2 className="w-4 h-4" /> Compartilhar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive"><X className="w-4 h-4" /> Remover</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`wishlist-card ${!isGrid ? 'flex items-stretch' : ''}`}>
      {image}
      <CardContent className={`${isGrid ? 'p-3' : 'p-3 flex-1'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-medium truncate">{item.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{item.location} • {item.timeAgo}</div>
          </div>
          <div className="text-pink-700 font-semibold whitespace-nowrap">{item.price ?? ''}</div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">{item.type}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2"><MessageCircle className="w-4 h-4" /> Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><Share2 className="w-4 h-4" /> Compartilhar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-2 py-1.5 text-left w-full hover:bg-destructive/10 text-destructive inline-flex items-center gap-2"><X className="w-4 h-4" /> Remover</button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover dos favoritos?</AlertDialogTitle>
                    <AlertDialogDescription>Você poderá adicioná-lo novamente mais tarde.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onToggleLike}>Remover</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
