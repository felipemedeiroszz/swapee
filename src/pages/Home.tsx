import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProductCard from '@/components/ProductCard';
import FiltersDialog from '@/components/FiltersDialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import type { FilterState } from '@/components/FiltersDialog';
import LanguageSelector from '@/components/LanguageSelector';
import { listItems, type Item } from '@/services/items';
import { likeItem, passItem } from '@/services/discovery';
import { ApiError } from '@/lib/api';
import { buildImageUrls } from '@/lib/images';
import "../styles/discover.css";

// Helper para converter Item da API para Product do ProductCard
const convertItemToProduct = (item: Item): Product => {
  // Mapear tipo da API para o formato do ProductCard
  const typeMap: Record<string, 'Troca' | 'Doação'> = {
    troca: 'Troca',
    doacao: 'Doação',
  };

  // Mapear condição
  const conditionMap: Record<string, string> = {
    novo: 'Novo',
    seminovo: 'Seminovo',
    usado: 'Usado',
  };

  // Normalizar imagens - construir URLs usando CDN
  const images = buildImageUrls(item.imagens);
  
  // Debug em desenvolvimento - SEMPRE logar para identificar o problema
  if (import.meta.env.DEV) {
    console.log('[Home] convertItemToProduct - Item recebido:', {
      id: item.id,
      titulo: item.titulo,
      imagensRaw: item.imagens,
      imagensType: typeof item.imagens,
      imagensIsArray: Array.isArray(item.imagens),
    });
    console.log('[Home] convertItemToProduct - Images convertidas:', images);
    
    // Validar se todas as URLs estão completas
    images.forEach((img, idx) => {
      if (!img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/')) {
        console.error(`[Home] ERRO: Imagem ${idx} não tem URL completa:`, img);
      }
    });
  }

  return {
    id: item.id,
    title: item.titulo,
    images,
    category: item.categoria,
    condition: conditionMap[item.condicao] || item.condicao,
    type: typeMap[item.tipo] || 'Troca',
    description: item.descricao,
    location: item.localizacao,
    distance: '0 km', // TODO: Calcular distância baseada na localização do usuário
  };
};

interface Product {
  id: string;
  title: string;
  images: string[];
  category: string;
  condition: string;
  type: 'Troca' | 'Doação';
  description: string;
  location: string;
  distance: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    distancia: 50,
    categorias: [],
    condicao: 'todas',
    preco: [0, 1000],
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const { items, unreadCount, markAllAsRead } = useNotifications();

  // Buscar itens da API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await listItems({
          tipo: 'troca', // Apenas itens de troca na descoberta
          status: 'ativo',
          limit: 50, // Buscar mais itens para ter uma boa quantidade
        });

        // Debug: verificar formato das imagens que vêm da API
        if (import.meta.env.DEV && response.items.length > 0) {
          console.log('[Home] Primeiro item da API:', {
            id: response.items[0].id,
            titulo: response.items[0].titulo,
            imagens: response.items[0].imagens,
            imagensType: typeof response.items[0].imagens,
            imagensLength: response.items[0].imagens?.length
          });
        }

        const convertedProducts = response.items.map(convertItemToProduct);
        
        // Debug: verificar formato após conversão
        if (import.meta.env.DEV && convertedProducts.length > 0) {
          console.log('[Home] Primeiro produto convertido:', {
            id: convertedProducts[0].id,
            title: convertedProducts[0].title,
            images: convertedProducts[0].images,
          });
        }
        
        setProducts(convertedProducts);
        setCurrentIndex(0); // Resetar índice ao carregar novos itens
      } catch (error) {
        const apiError = error as ApiError;
        toast({
          title: 'Erro ao carregar itens',
          description: apiError.message || 'Não foi possível carregar os itens para descoberta.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [toast]);

  const handleSwipeRight = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    try {
      // Enviar like para a API
      await likeItem(productId, 'like');
      
      toast({
        title: t('liked') || 'Curtiu!',
        description: t('youLiked', { title: product?.title || '' }) || `Você curtiu "${product?.title || ''}"`,
      });

      // Set default conversation context as 'Troca' and lock type for the next chat session
      try {
        localStorage.setItem('swapee-default-conv-type', 'Troca');
        localStorage.setItem('swapee-lock-type', '1');
      } catch {}

      nextProduct();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Erro',
        description: apiError.message || 'Não foi possível curtir o item.',
      });
    }
  };

  const handleSwipeLeft = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    try {
      // Enviar pass para a API
      await passItem(productId);
      
      toast({
        title: t('passed') || 'Passou',
        description: t('youPassed', { title: product?.title || '' }) || `Você passou em "${product?.title || ''}"`,
      });
      
      nextProduct();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Erro',
        description: apiError.message || 'Não foi possível processar a ação.',
      });
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    toast({
      title: t('filters'),
      description: t('filtersApplied'),
    });
  };

  const nextProduct = () => {
    const trocaProducts = products.filter(p => p.type === 'Troca');
    if (currentIndex < trocaProducts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // No more products
      toast({
        title: t('endOfList'),
        description: t('endOfListDesc'),
      });
    }
  };

  const trocaProducts = products.filter(p => p.type === 'Troca');
  const currentProduct = trocaProducts[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50">
      <div className="flex items-center justify-between bg-background/95 backdrop-blur-md border-b border-border z-40 fixed top-0 left-0 right-0 p-2 sm:p-3">

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/" className="flex items-center group" title="Página Inicial">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <img 
                src="/logoswapee.png" 
                alt="Swapee Logo" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
          <div className="h-6 w-px bg-border mx-1 sm:mx-2" />
          <h2 className="text-sm sm:text-base font-medium text-muted-foreground">
            Descubra
          </h2>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <LanguageSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('notifications') || 'Notificações'}>
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1 h-4 min-w-[16px] justify-center" variant="destructive">
                      <span className="text-[10px] leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    </Badge>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t('notifications') || 'Notificações'}</span>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={markAllAsRead}>{t('markAllAsRead') || 'Marcar todas como lidas'}</Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.length === 0 ? (
                <DropdownMenuItem disabled className="text-muted-foreground text-sm">
                  {t('noNotifications') || 'Sem notificações'}
                </DropdownMenuItem>
              ) : (
                <div className="max-h-80 overflow-auto py-1">
                  {items.map((n) => (
                    <div key={n.id} className="px-2 py-2 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{n.title}</span>
                            {n.unread && <span className="inline-block w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          {n.description && (
                            <div className="text-muted-foreground text-xs mt-0.5">{n.description}</div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                {t('viewAll') || 'Ver todas'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FiltersDialog onFiltersChange={handleFiltersChange} resultCount={products.length} />
        </div>
      </div>
      
      <main className="flex flex-col pt-20 pb-24 md:pt-24">
        <div className="flex flex-col items-center justify-center p-4">
          {loading ? (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Carregando itens...</p>
            </div>
          ) : currentProduct ? (
            <div className="w-full max-w-sm flex flex-col justify-center">
              <ProductCard
                product={currentProduct}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
              />
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-foreground">{t('congratulations') || 'Parabéns!'}</h2>
              <p className="text-muted-foreground">
                {t('allProductsViewed') || 'Você visualizou todos os produtos disponíveis'}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('comeBackLater') || 'Volte mais tarde para descobrir novos itens!'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom action bar */}
      {currentProduct && (
        <div className="mobile-bar md:hidden">
          <div className="mobile-bar-inner">
            <Button
              variant="pass"
              className="flex-1 h-12 text-base"
              onClick={() => handleSwipeLeft(currentProduct.id)}
            >
              {t('pass') || 'Passar'}
            </Button>
            <Button
              variant="love"
              className="flex-1 h-12 text-base"
              onClick={() => handleSwipeRight(currentProduct.id)}
            >
              {t('like') || 'Gostei'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;