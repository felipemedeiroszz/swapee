import { useState } from 'react';
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
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';

// Mock data - in a real app this would come from an API
const mockProducts = [
  {
    id: '1',
    title: 'Blazer Rosa Estiloso',
    images: [product1],
    category: 'Roupas',
    condition: 'Seminovo',
    type: 'Troca' as const,
    description: 'Lindo blazer rosa em excelente estado, usado apenas duas vezes. Perfeito para ocasiões especiais!',
    location: 'São Paulo, SP',
    distance: '2.5 km'
  },
  {
    id: '2',
    title: 'Bolsa de Couro Vintage',
    images: [product2],
    category: 'Acessórios',
    condition: 'Bom estado',
    type: 'Doação' as const,
    description: 'Bolsa de couro marrom vintage com detalhes dourados. Tem algumas marquinhas do uso, mas ainda muito bonita.',
    location: 'Rio de Janeiro, RJ',
    distance: '5.2 km'
  },
  {
    id: '3',
    title: 'Tênis Branco Minimalista',
    images: [product3],
    category: 'Calçados',
    condition: 'Novo',
    type: 'Troca' as const,
    description: 'Tênis branco novo, nunca usado. Comprei no tamanho errado e não consegui trocar na loja.',
    location: 'Belo Horizonte, MG',
    distance: '1.8 km'
  }
];

const Home = () => {
  const [products, setProducts] = useState(mockProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    distance: 50,
    categories: [],
    condition: 'all'
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const { items, unreadCount, markAllAsRead } = useNotifications();

  const handleSwipeRight = (productId: string) => {
    const product = products.find(p => p.id === productId);
    toast({
      title: t('liked'),
      description: t('youLiked', { title: product?.title || '' }),
    });
    nextProduct();
  };

  const handleSwipeLeft = (productId: string) => {
    const product = products.find(p => p.id === productId);
    toast({
      title: t('passed'),
      description: t('youPassed', { title: product?.title || '' }),
    });
    nextProduct();
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    toast({
      title: t('filters'),
      description: t('filtersApplied'),
    });
  };

  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // No more products
      toast({
        title: t('endOfList'),
        description: t('endOfListDesc'),
      });
    }
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-accent via-background to-accent/50">
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
          <FiltersDialog onFiltersChange={handleFiltersChange} />
        </div>
      </div>
      
      <main className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {currentProduct ? (
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
              <ProductCard
                product={currentProduct}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
              />
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-foreground">{t('congratulations')}</h2>
              <p className="text-muted-foreground">
                {t('allProductsViewed')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('comeBackLater')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;