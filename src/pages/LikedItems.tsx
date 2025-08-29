import { Heart, MessageCircle, ArrowLeft, Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Header from '@/components/Header';
import SwipeableCard from '@/components/SwipeableCard';

// Dados de exemplo - em uma aplicação real, isso viria de uma API
const mockLikedItems = [
  {
    id: '1',
    title: 'Jaqueta de Couro',
    image: 'https://images.unsplash.com/photo-1551028719-00167d1f7aa4?w=300&h=300&fit=crop',
    type: 'Troca',
    price: null,
    location: 'São Paulo, SP',
    timeAgo: '2 dias atrás',
    isMatched: true,
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
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState(mockLikedItems);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'matches' && item.isMatched);
    
    return matchesSearch && matchesFilter;
  });

  const handleSwipeLeft = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.error('Item removido dos favoritos');
  };

  const handleSwipeRight = (itemId: string) => {
    // Aqui você pode adicionar lógica para iniciar uma conversa ou marcar como favorito
    const item = items.find(item => item.id === itemId);
    if (item) {
      toast.success(`Você gostou de ${item.title}`);
      // Remove imediatamente para mostrar o próximo
      setItems(prevItems => prevItems.filter(i => i.id !== itemId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-accent/5">
      <Header 
        title="Itens Curtidos"
        leftIcon={
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-accent/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      />
      
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        {/* Barra de Pesquisa e Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar itens curtidos..."
              className="pl-10 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              className="text-xs sm:text-sm"
              onClick={() => setActiveFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={activeFilter === 'matches' ? 'default' : 'outline'} 
              className="text-xs sm:text-sm"
              onClick={() => setActiveFilter('matches')}
            >
              Apenas Matches
            </Button>
          </div>
        </div>

        {/* Lista de Itens Curtidos */}
        {filteredItems.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center text-sm text-muted-foreground">
              Arraste para a direita para Gostei • Arraste para a esquerda para Remover
            </div>
            
            <div className="relative h-[500px] w-full max-w-md mx-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      zIndex: filteredItems.length - index,
                      transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                      opacity: 1 - (index * 0.1)
                    }}
                  >
                    <SwipeableCard
                      item={item}
                      onSwipeLeft={() => handleSwipeLeft(item.id)}
                      onSwipeRight={() => handleSwipeRight(item.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Nenhum item para mostrar</p>
                </div>
              )}
            </div>
            
            {/* Ações de botão para dispositivos móveis */}
            <div className="flex justify-center gap-4 mt-6 sm:hidden">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-16 w-16 rounded-full"
                onClick={() => filteredItems[0] && handleSwipeLeft(filteredItems[0].id)}
              >
                <X className="h-8 w-8" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
                onClick={() => filteredItems[0] && handleSwipeRight(filteredItems[0].id)}
              >
                <Heart className="h-8 w-8 fill-white" />
              </Button>
            </div>
            
            {/* Lista de itens restantes */}
            {filteredItems.length > 1 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Próximos itens</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredItems.slice(1, 4).map((item, index) => (
                    <Card key={item.id} className="overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                      <div className="relative aspect-square">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-2">
                        <p className="text-xs font-medium truncate">{item.title}</p>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline" className="text-[10px] h-5">
                            {item.type}
                          </Badge>
                          {item.price && (
                            <span className="text-xs font-medium">
                              {item.price}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm || activeFilter !== 'all' 
                ? 'Nenhum item encontrado' 
                : 'Nenhum item curtido ainda'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || activeFilter !== 'all'
                ? 'Tente ajustar sua busca ou filtros para encontrar o que procura.'
                : 'Explore itens disponíveis e clique no coração para salvar seus favoritos.'}
            </p>
            {(searchTerm || activeFilter !== 'all') ? (
              <Button onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}>
                Limpar filtros
              </Button>
            ) : (
              <Button onClick={() => navigate('/')}>
                Explorar itens
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LikedItems;
