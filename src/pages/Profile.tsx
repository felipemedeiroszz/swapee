import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, MapPin, Heart, Package, Coins, Crown, Stars, Star, LogOut, HandHeart } from 'lucide-react';

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

  // Coins (pontuação) and dynamic donations from localStorage
  const [coins, setCoins] = useState<number>(0);
  const [donations, setDonations] = useState<number>(user.stats.donations);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('swapee-coins') || '0', 10);
    const storedDonations = parseInt(localStorage.getItem('swapee-donations') || String(user.stats.donations), 10);
    setCoins(isNaN(storedCoins) ? 0 : storedCoins);
    setDonations(isNaN(storedDonations) ? user.stats.donations : storedDonations);
    // Load ratings average for this user
    try {
      const raw = localStorage.getItem('swapee-user-ratings') || '{}';
      const data = JSON.parse(raw);
      const list: number[] = Array.isArray(data[user.name]) ? data[user.name] : [];
      const avg = list.length ? (list.reduce((a, b) => a + b, 0) / list.length) : 0;
      setAvgRating(avg);
      setTotalRatings(list.length);
    } catch {
      setAvgRating(0);
      setTotalRatings(0);
    }
  }, [user.stats.donations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50">
      <Header 
        title="Meu Perfil" 
        onSettingsClick={() => navigate('/perfil/configuracoes')}
        showNotifications
      />
      
      <main className="pt-16 pb-24">
        {/* Avatar */}
        <div className="relative animate-in fade-in-50">
          <div className="px-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-background shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{user.name}</h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                {/* Average rating */}
                <div className="mt-1 flex items-center gap-1.5">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${avgRating >= n ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {avgRating.toFixed(1)} ({totalRatings})
                  </span>
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
              <HandHeart className="w-5 h-5 mx-auto mb-1 text-rose-500" />
              <div className="text-lg font-bold text-foreground">{donations}</div>
              <div className="text-xs text-muted-foreground">Doações</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <div className="text-lg font-bold text-foreground">{coins}</div>
              <div className="text-xs text-muted-foreground">Coins</div>
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
              <img src="/verificado.gif" alt="Verificado" />
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
          
          {/* Logout Button */}
          <div className="mt-4">
            <Button 
              variant="destructive" 
              className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out group"
              onClick={() => {
                // Clear user data from localStorage
                localStorage.removeItem('swapee-coins');
                localStorage.removeItem('swapee-donations');
                localStorage.removeItem('swapee-user-ratings');
                // Navigate to login page
                navigate('/login');
              }}
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Fazer Logout</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;