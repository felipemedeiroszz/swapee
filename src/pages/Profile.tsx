import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, MapPin, Heart, Package, MessageCircle, Settings, Crown, Stars } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import '../styles/premium.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Maria Silva',
    location: 'São Paulo, SP',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&h=400&fit=crop',
    stats: {
      items: 12,
      trades: 8,
      donations: 4,
      matches: 15
    }
  });

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50">
      <Header 
        title="Meu Perfil" 
        onSettingsClick={() => navigate('/perfil/configuracoes')}
        showNotifications
      />
      
      <main className="pt-16 pb-24">
        {/* Cover + Avatar */}
        <div className="relative animate-in fade-in-50">
          <div className="h-40 sm:h-56 w-full overflow-hidden rounded-b-3xl shadow">
            <img src={user.cover} alt="Capa do perfil" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="px-4">
            <div className="-mt-10 sm:-mt-12 flex items-end gap-3">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-background shadow-lg"
                />
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{user.name}</h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 px-4 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in-50 slide-in-from-bottom-2">
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

        {/* Premium CTA */}
        <div className="mt-6 px-4 animate-in fade-in-50 slide-in-from-bottom-2">
          <div className="premium-cta">
            <button className="premium-button" onClick={() => navigate('/premium')}
              aria-label="Virar Premium por $4,99/mês">
              <span className="sparkle-strip" aria-hidden="true"></span>
              <span className="premium-left">
                <Crown className="w-5 h-5 text-amber-800" />
                <span className="premium-title">
                  <span className="line-top">Virar Premium</span>
                  <span className="line-bottom">Acesso a recursos exclusivos</span>
                </span>
              </span>
              <span className="premium-price">$4,99/mês</span>
              <span className="premium-right">
                <Stars className="w-5 h-5 text-amber-800" />
              </span>
            </button>
            <div className="premium-verified">
              <img src="public/verificado.gif" alt="Verificado" />
              Perfil verificado e benefícios exclusivos
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 px-4 grid gap-4 animate-in fade-in-50 slide-in-from-bottom-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-12 hover:-translate-y-0.5 hover:shadow transition"
              onClick={() => navigate('/itens-curtidos')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Itens Curtidos
            </Button>
            <Button 
              variant="outline" 
              className="h-12 hover:-translate-y-0.5 hover:shadow transition"
              onClick={() => navigate('/meus-itens')}
            >
              <Package className="w-4 h-4 mr-2" />
              Meus Itens
            </Button>
            <Button 
              variant="outline" 
              className="h-12 hover:-translate-y-0.5 hover:shadow transition"
              onClick={() => navigate('/perfil/editar')}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;