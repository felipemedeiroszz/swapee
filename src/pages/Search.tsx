import { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'roupas', label: 'Roupas' },
    { id: 'calcados', label: 'Calçados' },
    { id: 'acessorios', label: 'Acessórios' },
    { id: 'eletronicos', label: 'Eletrônicos' },
    { id: 'livros', label: 'Livros' },
    { id: 'casa', label: 'Casa' }
  ];

  const searchResults = [
    {
      id: '1',
      title: 'iPhone 12 Pro',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      type: 'Troca',
      location: 'São Paulo, SP',
      distance: '3.2 km'
    },
    {
      id: '2',
      title: 'Jaqueta Jeans',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      type: 'Doação',
      location: 'São Paulo, SP',
      distance: '1.8 km'
    },
    {
      id: '3',
      title: 'Tênis Nike',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      type: 'Troca',
      location: 'São Paulo, SP',
      distance: '5.1 km'
    },
    {
      id: '4',
      title: 'Coleção Harry Potter',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      type: 'Doação',
      location: 'São Paulo, SP',
      distance: '2.7 km'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50">
      <Header title="Buscar" showNotifications />
      
      <main className="pt-20 pb-24 px-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-12 rounded-xl border-0 bg-gradient-card shadow-card"
          />
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Categorias</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge variant="outline" className="whitespace-nowrap">
            <MapPin className="w-3 h-3 mr-1" />
            Até 10km
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Disponível para troca
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Novo/Seminovo
          </Badge>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {searchResults.length} resultados encontrados
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {searchResults.map((item) => (
              <Card key={item.id} className="bg-gradient-card shadow-card border-0 overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant={item.type === 'Doação' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-foreground text-sm mb-1">{item.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{item.distance}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;