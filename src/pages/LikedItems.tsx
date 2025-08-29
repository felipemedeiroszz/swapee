import { Heart, MessageCircle, ArrowLeft, Search, Filter, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

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

  const filteredItems = mockLikedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'matches' && item.isMatched);
    
    return matchesSearch && matchesFilter;
  });

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
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Imagem do Item */}
                  <div className="w-full sm:w-40 h-48 sm:h-auto relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.isMatched && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <Heart className="w-3 h-3 mr-1 fill-current" />
                          Match!
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Detalhes do Item */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-foreground">{item.title}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant={item.type === 'Doação' ? 'secondary' : 'default'} className="text-xs">
                            {item.type}
                          </Badge>
                          {item.price && (
                            <span className="ml-2 text-sm font-medium text-foreground">
                              {item.price}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          {item.location} • {item.timeAgo}
                        </div>
                      </div>
                    </div>
                    
                    {/* Info do Anunciante */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center">
                        <img
                          src={item.user.avatar}
                          alt={item.user.name}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium">{item.user.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(item.user.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              {item.user.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Ações */}
                <CardFooter className="bg-muted/30 p-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    {item.isMatched ? 'Match!' : 'Curtido'}
                  </Button>
                  <Button size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {item.isMatched ? 'Conversar' : 'Solicitar'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
