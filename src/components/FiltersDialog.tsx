import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup } from '@/components/ui/radio-group';
import { Sliders, MapPin, Tag, BadgePercent, Shirt, Book, Wrench, Laptop, Boxes, Search, X, ChevronDown, Coins } from 'lucide-react';
import '../styles/filters.css';

interface FiltersDialogProps {
  onFiltersChange?: (filters: FilterState) => void;
  resultCount?: number;
}

export interface FilterState {
  distancia: number;
  categorias: string[];
  condicao: string;
  preco: [number, number];
}

const CATEGORIES: { id: string; label: string; icon: ComponentType<any> }[] = [
  { id: 'eletronicos', label: 'Eletrônicos', icon: Laptop },
  { id: 'eletrodomesticos', label: 'Eletrodomésticos', icon: Boxes },
  { id: 'ferramentas', label: 'Ferramentas', icon: Wrench },
  { id: 'roupas', label: 'Roupas', icon: Shirt },
  { id: 'acessorios', label: 'Acessórios', icon: Tag },
  { id: 'livros', label: 'Livros', icon: Book },
  { id: 'brinquedos', label: 'Brinquedos', icon: Boxes },
  { id: 'outros', label: 'Outros', icon: Tag },
];

const CONDITIONS: { id: string; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'novo', label: 'Novo' },
  { id: 'seminovo', label: 'Seminovo' },
  { id: 'bom', label: 'Em bom estado' },
];

const DEFAULT_DISTANCIA = 50;
const DEFAULT_PRECO: [number, number] = [0, 1000];

const FiltersDialog = ({ onFiltersChange, resultCount }: FiltersDialogProps) => {
  const [open, setOpen] = useState(false);
  const [distancia, setDistancia] = useState<[number]>([DEFAULT_DISTANCIA]);
  const [preco, setPreco] = useState<[number, number]>(DEFAULT_PRECO);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [condicao, setCondicao] = useState('todas');
  const [buscaCategoria, setBuscaCategoria] = useState('');
  const [expand, setExpand] = useState<{[k: string]: boolean}>({ categorias: true, condicao: true, distancia: true, preco: true });
  const [historico, setHistorico] = useState<FilterState[]>([]);

  const touchStartY = useRef<number | null>(null);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategoriasSelecionadas(prev => [...prev, category]);
    } else {
      setCategoriasSelecionadas(prev => prev.filter(c => c !== category));
    }
  };

  const filtrosAtivos = useMemo(() => {
    let count = 0;
    if (distancia[0] !== DEFAULT_DISTANCIA) count++;
    if (categoriasSelecionadas.length > 0) count += categoriasSelecionadas.length;
    if (condicao !== 'todas') count++;
    if (preco[0] !== DEFAULT_PRECO[0] || preco[1] !== DEFAULT_PRECO[1]) count++;
    return count;
  }, [distancia, categoriasSelecionadas, condicao, preco]);

  const emitFilters = () => {
    const filters: FilterState = {
      distancia: distancia[0],
      categorias: categoriasSelecionadas,
      condicao,
      preco,
    };
    onFiltersChange?.(filters);
  };

  useEffect(() => {
    // Emissão em tempo real para preview dos resultados
    emitFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distancia, categoriasSelecionadas, condicao, preco]);

  useEffect(() => {
    // Carregar histórico
    try {
      const raw = localStorage.getItem('filters_history');
      if (raw) setHistorico(JSON.parse(raw));
    } catch {}
  }, []);

  const salvarHistorico = (f: FilterState) => {
    try {
      const novo = [f, ...historico].slice(0, 5);
      setHistorico(novo);
      localStorage.setItem('filters_history', JSON.stringify(novo));
    } catch {}
  };

  const handleApplyFilters = () => {
    const filters: FilterState = {
      distancia: distancia[0],
      categorias: categoriasSelecionadas,
      condicao,
      preco,
    };
    onFiltersChange?.(filters);
    salvarHistorico(filters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    setDistancia([DEFAULT_DISTANCIA]);
    setCategoriasSelecionadas([]);
    setCondicao('todas');
    setPreco(DEFAULT_PRECO);
  };

  const removeChip = (type: 'categoria' | 'condicao' | 'distancia' | 'preco', value?: string) => {
    if (type === 'categoria' && value) setCategoriasSelecionadas(prev => prev.filter(c => c !== value));
    if (type === 'condicao') setCondicao('todas');
    if (type === 'distancia') setDistancia([DEFAULT_DISTANCIA]);
    if (type === 'preco') setPreco(DEFAULT_PRECO);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const startY = touchStartY.current;
    if (startY == null) return;
    const endY = e.changedTouches[0].clientY;
    if (endY - startY > 80) setOpen(false); // swipe down
    touchStartY.current = null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="filters-trigger-btn">
          <Sliders className="w-4 h-4" />
          <span className="ml-2">Filtros</span>
          {filtrosAtivos > 0 && (
            <span className="ml-2 filters-badge">{filtrosAtivos}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="filters-content"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[15px] sm:text-base">
            <Sliders className="w-5 h-5" />
            Filtrar resultados {typeof resultCount === 'number' && (<span className="text-muted-foreground text-sm">({resultCount} resultados)</span>)}
          </DialogTitle>
        </DialogHeader>

        {/* Chips de filtros aplicados */}
        <div className="filters-chips-container">
          {categoriasSelecionadas.map(id => {
            const cat = CATEGORIES.find(c => c.id === id);
            return (
              <button key={id} className="chip" onClick={() => removeChip('categoria', id)}>
                <span>{cat?.label}</span>
                <X className="w-3 h-3" />
              </button>
            );
          })}
          {condicao !== 'todas' && (
            <button className="chip" onClick={() => removeChip('condicao')}>
              <span>Condição: {CONDITIONS.find(c => c.id === condicao)?.label}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {(distancia[0] !== DEFAULT_DISTANCIA) && (
            <button className="chip" onClick={() => removeChip('distancia')}>
              <span>Raio: {distancia[0]} km</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {(preco[0] !== DEFAULT_PRECO[0] || preco[1] !== DEFAULT_PRECO[1]) && (
            <button className="chip" onClick={() => removeChip('preco')}>
              <span>Preço: R$ {preco[0]} - R$ {preco[1]}</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Distance Slider */}
          <div className="filters-section">
            <button className="filters-section-header" onClick={() => setExpand(s => ({...s, distancia: !s.distancia}))}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Raio de Busca</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${expand.distancia ? 'rotate-180' : ''}`} />
            </button>
            {expand.distancia && (
              <div className="space-y-2">
                <Slider
                  value={distancia}
                  onValueChange={setDistancia}
                  max={200}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span className="font-medium">{distancia[0]} km</span>
                  <span>200 km</span>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="filters-section">
            <button className="filters-section-header" onClick={() => setExpand(s => ({...s, categorias: !s.categorias}))}>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Categorias</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${expand.categorias ? 'rotate-180' : ''}`} />
            </button>
            {expand.categorias && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className="filters-input"
                    placeholder="Buscar categorias"
                    value={buscaCategoria}
                    onChange={(e) => setBuscaCategoria(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.filter(c => c.label.toLowerCase().includes(buscaCategoria.toLowerCase())).map((category) => (
                    <label key={category.id} className={`category-card ${categoriasSelecionadas.includes(category.id) ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={categoriasSelecionadas.includes(category.id)}
                        onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      />
                      <category.icon className="w-4 h-4" />
                      <span className="truncate">{category.label}</span>
                    </label>
                  ))}
                </div>
                {categoriasSelecionadas.length > 0 && (
                  <div className="text-xs text-muted-foreground">{categoriasSelecionadas.length} selecionada(s)</div>
                )}
              </div>
            )}
          </div>

          {/* Condition */}
          <div className="filters-section">
            <button className="filters-section-header" onClick={() => setExpand(s => ({...s, condicao: !s.condicao}))}>
              <div className="flex items-center gap-2">
                <BadgePercent className="w-4 h-4" />
                <span>Condição</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${expand.condicao ? 'rotate-180' : ''}`} />
            </button>
            {expand.condicao && (
              <RadioGroup value={condicao} onValueChange={setCondicao} className="mt-2 space-y-2">
                {CONDITIONS.map((cond) => (
                  <label key={cond.id} className={`radio-card ${condicao === cond.id ? 'active' : ''}`}>
                    <input type="radio" name="condicao" className="hidden" value={cond.id} onChange={() => setCondicao(cond.id)} />
                    <span>{cond.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Price Range */}
          <div className="filters-section">
            <button className="filters-section-header" onClick={() => setExpand(s => ({...s, preco: !s.preco}))}>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>Preço</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${expand.preco ? 'rotate-180' : ''}`} />
            </button>
            {expand.preco && (
              <div className="space-y-2">
                <Slider
                  value={preco}
                  onValueChange={setPreco}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>R$ {preco[0]}</span>
                  <span className="font-medium">R$ {preco[0]} - R$ {preco[1]}</span>
                  <span>R$ {preco[1]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input inputMode="numeric" className="filters-input" value={preco[0]} onChange={(e) => setPreco([Number(e.target.value)||0, preco[1]])} />
                  <input inputMode="numeric" className="filters-input" value={preco[1]} onChange={(e) => setPreco([preco[0], Number(e.target.value)||0])} />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="filters-actions">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Limpar tudo
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 apply-btn"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;