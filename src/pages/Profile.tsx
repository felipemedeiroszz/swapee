import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, MapPin, Heart, Package, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Maria Silva',
    location: 'São Paulo, SP',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    stats: {
      items: 12,
      trades: 8,
      donations: 4,
      matches: 15
    }
  });

  const [userItems] = useState([
    {
      id: '1',
      title: 'Vestido Floral',
      image: 'https://images.unsplash.com/photo-1566479179817-c1f3e70b14e2?w=300&h=300&fit=crop',
      type: 'Troca',
      status: 'Disponível'
    },
    {
      id: '2',
      title: 'Sapato Social',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      type: 'Doação',
      status: 'Match!'
    },
    {
      id: '3',
      title: 'Livro de Culinária',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      type: 'Troca',
      status: 'Disponível'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50">
      <Header 
        title="Meu Perfil" 
        onSettingsClick={() => console.log('Settings clicked')}
        showNotifications
      />
      
      <main className="pt-20 pb-24 px-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                  <Edit3 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  onClick={() => navigate('/perfil/editar')}
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Perfil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-3 text-center">
              <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-bold text-foreground">{user.stats.items}</div>
              <div className="text-xs text-muted-foreground">Itens</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-3 text-center">
              <Heart className="w-5 h-5 mx-auto mb-1 text-love" />
              <div className="text-lg font-bold text-foreground">{user.stats.matches}</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-3 text-center">
              <MessageCircle className="w-5 h-5 mx-auto mb-1 text-secondary" />
              <div className="text-lg font-bold text-foreground">{user.stats.trades}</div>
              <div className="text-xs text-muted-foreground">Trocas</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-3 text-center">
              <Settings className="w-5 h-5 mx-auto mb-1 text-accent-foreground" />
              <div className="text-lg font-bold text-foreground">{user.stats.donations}</div>
              <div className="text-xs text-muted-foreground">Doações</div>
            </CardContent>
          </Card>
        </div>

        {/* My Items */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Meus Itens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.type === 'Doação' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {item.type}
                    </Badge>
                    <Badge 
                      variant={item.status === 'Match!' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => navigate('/itens-curtidos')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Itens Curtidos
          </Button>
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => navigate('/meus-itens')}
          >
            <Package className="w-4 h-4 mr-2" />
            Meus Itens
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;