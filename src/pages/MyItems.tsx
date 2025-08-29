import { useState } from 'react';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

// Dados de exemplo - em uma aplicação real, isso viria de uma API
const mockItems = {
  active: [
    {
      id: '1',
      title: 'Vestido Floral',
      image: 'https://images.unsplash.com/photo-1566479179817-c1f3e70b14e2?w=300&h=300&fit=crop',
      type: 'Troca',
      status: 'Disponível',
      date: 'Publicado em 15/08/2023',
      views: 124,
      matches: 3
    },
    {
      id: '2',
      title: 'Sapato Social Preto',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      type: 'Doação',
      status: 'Match!',
      date: 'Publicado em 10/08/2023',
      views: 89,
      matches: 1
    },
  ],
  pending: [
    {
      id: '3',
      title: 'Livro de Culinária Vegana',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      type: 'Troca',
      status: 'Em Análise',
      date: 'Enviado em 20/08/2023',
    }
  ],
  inactive: [
    {
      id: '4',
      title: 'Bicicleta Aro 29',
      image: 'https://images.unsplash.com/photo-1507030584938-7f3a6d0c7d1b?w=300&h=300&fit=crop',
      type: 'Venda',
      status: 'Vendido',
      date: 'Finalizado em 05/08/2023',
    }
  ]
};

const MyItems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

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
        return 'ghost';
      default:
        return 'default';
    }
  };

  const getTypeVariant = (type: string) => {
    return type === 'Doação' ? 'secondary' : 'default';
  };

  const filteredItems = {
    active: mockItems.active.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    pending: mockItems.pending.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    inactive: mockItems.inactive.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-accent/5">
      <Header 
        title="Meus Itens"
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
              placeholder="Buscar meus itens..."
              className="pl-10 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <Button className="gap-2" onClick={() => navigate('/adicionar-item')}>
            <Plus className="w-4 h-4" />
            Novo Item
          </Button>
        </div>

        {/* Abas */}
        <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Ativos ({mockItems.active.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({mockItems.pending.length})</TabsTrigger>
            <TabsTrigger value="inactive">Encerrados ({mockItems.inactive.length})</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo das Abas */}
          <div className="mt-6">
            <TabsContent value="active">
              {filteredItems.active.length > 0 ? (
                <div className="grid gap-4">
                  {filteredItems.active.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-foreground">{item.title}</h3>
                            <Badge variant={getStatusVariant(item.status)} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge variant={getTypeVariant(item.type)} className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {item.date} • {item.views} visualizações • {item.matches} matches
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs" disabled={item.status === 'Match!'}>
                              {item.status === 'Match!' ? 'Em andamento' : 'Desativar'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum item ativo encontrado</p>
                  <Button className="mt-4" onClick={() => navigate('/adicionar-item')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {filteredItems.pending.length > 0 ? (
                <div className="grid gap-4">
                  {filteredItems.pending.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-70"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-foreground">{item.title}</h3>
                            <Badge variant={getStatusVariant(item.status)} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                          <div className="mt-1">
                            <Badge variant={getTypeVariant(item.type)} className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {item.date}
                          </div>
                          <div className="mt-3 text-sm text-muted-foreground">
                            Seu item está em análise e em breve estará disponível para visualização.
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum item pendente</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inactive">
              {filteredItems.inactive.length > 0 ? (
                <div className="grid gap-4">
                  {filteredItems.inactive.map((item) => (
                    <Card key={item.id} className="overflow-hidden opacity-70">
                      <div className="flex">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-foreground">{item.title}</h3>
                            <Badge variant={getStatusVariant(item.status)} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                          <div className="mt-1">
                            <Badge variant={getTypeVariant(item.type)} className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {item.date}
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="text-xs">
                              Republicar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum item encerrado</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default MyItems;
