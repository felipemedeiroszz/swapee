import { useMemo, useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, Grid2X2, List as ListIcon, X, SlidersHorizontal, Eye, Heart, Tag, Layers, Shirt, Book, Home, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import '../styles/search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState<'grid'|'list'>('grid');
  const [sort, setSort] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [distance, setDistance] = useState<number>(10);
  const [onlyTrade, setOnlyTrade] = useState<boolean>(false);
  const [condition, setCondition] = useState<'novo'|'seminovo'|'usado'|'any'>('any');
  const [loading, setLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'Todos', icon: Layers, count: 128 },
    { id: 'roupas', label: 'Roupas', icon: Shirt, count: 32 },
    { id: 'calcados', label: 'Calçados', icon: Tag, count: 21 },
    { id: 'acessorios', label: 'Acessórios', icon: Heart, count: 17 },
    { id: 'eletronicos', label: 'Eletrônicos', icon: Monitor, count: 23 },
    { id: 'livros', label: 'Livros', icon: Book, count: 15 },
    { id: 'casa', label: 'Casa', icon: Home, count: 20 }
  ];

  const allResults = [
    {
      id: '1',
      title: 'iPhone 12 Pro',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      type: 'Troca',
      location: 'São Paulo, SP',
      distance: '3.2 km',
      price: 3500
    },
    {
      id: '2',
      title: 'Jaqueta Jeans',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      type: 'Doação',
      location: 'São Paulo, SP',
      distance: '1.8 km',
      price: 0
    },
    {
      id: '3',
      title: 'Tênis Nike',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      type: 'Troca',
      location: 'São Paulo, SP',
      distance: '5.1 km',
      price: 250
    },
    {
      id: '4',
      title: 'Coleção Harry Potter',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      type: 'Doação',
      location: 'São Paulo, SP',
      distance: '2.7 km',
      price: 0
    }
  ];

  const searchResults = useMemo(() => {
    // Filter by category and simple flags
    let r = allResults
      .filter(r => r.type === 'Doação')
      .filter(r => selectedCategory === 'all' || r.title.toLowerCase().includes(selectedCategory));
    if (onlyTrade) r = r.filter(r => r.type === 'Troca');
    // Price range (mock): include all where price within range
    r = r.filter(r => r.price >= priceRange[0] && r.price <= priceRange[1]);
    // Sort mock
    if (sort === 'near') {
      r = [...r].sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sort === 'recent') {
      r = [...r].reverse();
    }
    return r;
  }, [allResults, selectedCategory, onlyTrade, priceRange, sort]);

  const activeChips = [
    distance ? `Até ${distance}km` : null,
    onlyTrade ? 'Disponível para troca' : null,
    condition !== 'any' ? (condition === 'novo' ? 'Novo' : condition === 'seminovo' ? 'Seminovo' : 'Usado') : null,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen search-shell bg-gradient-to-br from-[var(--pink-100)]/40 via-white to-[var(--pink-100)]/30">
      <Header title="Doação" showNotifications />

      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Categorias</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Pesquisar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Top search bar + mobile filter */}
        <div className="search-top mb-4">
          <div className="relative">
            <div className="searchbar-xl">
              <SearchIcon className="icon w-5 h-5" />
              <input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onFocus={() => setShowSuggest(true)}
                onBlur={() => setTimeout(()=>setShowSuggest(false), 150)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="ghost" size="sm" className="hidden lg:inline-flex text-[var(--pink-800)]"><SlidersHorizontal className="w-4 h-4 mr-1"/>Filtros</Button>
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="sm" className="lg:hidden"><Filter className="w-4 h-4 mr-1"/>Filtros</Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[88vw] sm:w-[420px]">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-6">
                    <div className="filter-section">
                      <p className="filter-title">Preço</p>
                      <Slider value={priceRange} min={0} max={5000} step={50} onValueChange={(v:any)=>setPriceRange([v[0], v[1]])} />
                      <div className="text-sm text-muted-foreground mt-2">R$ {priceRange[0]} - R$ {priceRange[1]}</div>
                    </div>
                    <Separator />
                    <div className="filter-section">
                      <p className="filter-title">Distância</p>
                      <Slider value={[distance]} min={1} max={50} step={1} onValueChange={(v:any)=>setDistance(v[0])} />
                      <div className="text-sm text-muted-foreground mt-2">Até {distance}km</div>
                    </div>
                    <Separator />
                    <div className="filter-section">
                      <p className="filter-title">Condição</p>
                      <div className="flex flex-wrap gap-2">
                        {['any','novo','seminovo','usado'].map((c)=> (
                          <Button key={c} size="sm" variant={condition===c? 'default':'outline'} onClick={()=>setCondition(c as any)} className="rounded-full">
                            {c==='any'?'Qualquer': c==='novo'?'Novo' : c==='seminovo'?'Seminovo':'Usado'}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="filter-section">
                      <p className="filter-title">Disponibilidade</p>
                      <Button size="sm" variant={onlyTrade? 'default':'outline'} onClick={()=>setOnlyTrade(v=>!v)} className="rounded-full">Disponível para troca</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {showSuggest && (
              <div className="search-suggest">
                <h4>Buscas recentes</h4>
                <ul>
                  {['iPhone', 'Jaqueta', 'Tênis', 'Harry Potter'].map((s)=> (
                    <li key={s}><button onMouseDown={()=>setSearchQuery(s)}>{s}</button></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Layout: 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Filters column (desktop) */}
          <div className="sidebar-desktop lg:col-span-3">
            <div className="bg-card-soft shadow-soft filters-panel p-3 space-y-4">
              <div className="filter-section">
                <p className="filter-title">Filtros Ativos</p>
                <div className="active-filters">
                  {activeChips.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Nenhum filtro aplicado</span>
                  ) : activeChips.map((chip) => (
                    <span key={chip} className="active-chip">{chip}<span className="x"><X className="w-3 h-3"/></span></span>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="filter-section">
                <p className="filter-title">Preço</p>
                <Slider value={priceRange} min={0} max={5000} step={50} onValueChange={(v:any)=>setPriceRange([v[0], v[1]])} />
                <div className="text-sm text-muted-foreground mt-2">R$ {priceRange[0]} - R$ {priceRange[1]}</div>
              </div>
              <Separator />
              <div className="filter-section">
                <p className="filter-title">Distância</p>
                <Slider value={[distance]} min={1} max={50} step={1} onValueChange={(v:any)=>setDistance(v[0])} />
                <div className="text-sm text-muted-foreground mt-2">Até {distance}km</div>
              </div>
              <Separator />
              <div className="filter-section">
                <p className="filter-title">Disponibilidade</p>
                <Button size="sm" variant={onlyTrade? 'default':'outline'} onClick={()=>setOnlyTrade(v=>!v)} className="rounded-full">Disponível para troca</Button>
              </div>
              <Separator />
              <div className="filter-section">
                <p className="filter-title">Condição</p>
                <div className="flex flex-wrap gap-2">
                  {['any','novo','seminovo','usado'].map((c)=> (
                    <Button key={c} size="sm" variant={condition===c? 'default':'outline'} onClick={()=>setCondition(c as any)} className="rounded-full">
                      {c==='any'?'Qualquer': c==='novo'?'Novo' : c==='seminovo'?'Seminovo':'Usado'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 bg-card-soft shadow-soft p-3 rounded-2xl">
              <p className="filter-title mb-2">Produtos próximos</p>
              <div className="heatmap" />
            </div>
          </div>

          {/* Categories column */}
          <div className="lg:col-span-3">
            <div className="bg-card-soft shadow-soft p-3 rounded-2xl">
              <p className="filter-title mb-2">Categorias</p>
              <div className="category-menu">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const active = selectedCategory === c.id;
                  return (
                    <button key={c.id} className={`category-item ${active? 'active':''}`} onClick={()=>setSelectedCategory(c.id)}>
                      <Icon className="w-4 h-4 text-[var(--pink-800)]"/>
                      <span>{c.label}</span>
                      <span className="count">{c.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results column */}
          <div className="lg:col-span-6">
            <div className="bg-card-soft shadow-soft p-3 rounded-2xl mb-3 results-head">
              <h3 className="font-semibold">{searchResults.length} resultados encontrados</h3>
              <div className="flex items-center gap-2">
                <div className="view-toggle">
                  <button className={view==='grid'? 'active':''} onClick={()=>setView('grid')} aria-label="Ver em grade"><Grid2X2 className="w-4 h-4"/></button>
                  <button className={view==='list'? 'active':''} onClick={()=>setView('list')} aria-label="Ver em lista"><ListIcon className="w-4 h-4"/></button>
                </div>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Mais relevante</SelectItem>
                    <SelectItem value="near">Mais perto</SelectItem>
                    <SelectItem value="recent">Mais recente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters chips below header on mobile */}
            <div className="lg:hidden mb-3 active-filters">
              {activeChips.map((chip)=> (
                <span key={chip} className="active-chip">{chip}<span className="x"><X className="w-3 h-3"/></span></span>
              ))}
            </div>

            {/* Loading / Empty states */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({length:6}).map((_,i)=> (
                  <div key={i} className="h-40 rounded-xl bg-[var(--gray-100)] animate-pulse" />
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">Nenhum resultado para sua busca.</div>
            ) : (
              <div className={view==='grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
                {searchResults.map((item) => (
                  <Card key={item.id} className={`product-card ${view==='list' ? 'flex' : ''} cursor-pointer`} onClick={() => setSelectedItem(item)}>
                    <div className={view==='list' ? 'w-40 aspect-square relative' : 'aspect-square relative'}>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="badge">
                        <Badge variant={item.type === 'Doação' ? 'secondary' : 'default'} className="text-xs">{item.type}</Badge>
                      </div>
                      <div className="quick-view">
                        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}><Eye className="w-4 h-4 mr-1"/>Visualizar</Button>
                        <Button size="sm" variant="default" className="bg-[var(--pink-600)] hover:bg-[var(--pink-800)]"><Heart className="w-4 h-4 mr-1"/>Salvar</Button>
                      </div>
                    </div>
                    <CardContent className={view==='list' ? 'p-3 flex-1' : 'p-3'}>
                      <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                        <span>•</span>
                        <span>{item.distance}</span>
                      </div>
                      {view==='list' && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline">Disponível para troca</Badge>
                          <Badge variant="outline">Até {distance}km</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-3">
              <div className="aspect-square w-full overflow-hidden rounded-md">
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{selectedItem.location}</span>
                <span>•</span>
                <span>{selectedItem.distance}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="bg-[var(--pink-600)] hover:bg-[var(--pink-800)]" onClick={() => { localStorage.setItem('swapee-default-conv-type','Doação'); localStorage.setItem('swapee-lock-type','1'); navigate('/chat'); }}>Enviar mensagem</Button>
                <Button variant="outline" onClick={() => setSelectedItem(null)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;