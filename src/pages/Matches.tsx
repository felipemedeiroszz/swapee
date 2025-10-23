import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { listMatches as apiListMatches, Match } from '@/services/discovery';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import '../styles/matches.css';

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await apiListMatches();
        setMatches(response.matches);
      } catch (error: any) {
        toast.error(error.message || 'Falha ao carregar os matches.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleGoBack = () => navigate(-1);
  const handleGoToChat = (conversationId: string) => navigate(`/chat/${conversationId}`);

  return (
    <div className="matches-page">
      <Header />
      <main className="container">
        <div className="matches-header">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">Meus Matches</h1>
          <div />
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : matches.length === 0 ? (
          <p>Nenhum match encontrado.</p>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => (
              <div key={match.id} className="match-card">
                <div className="match-card-users">
                  <img src={match.item.usuario.avatar || 'https://placehold.co/100x100?text=A'} alt={match.item.usuario.nome} />
                  <img src={match.outroUsuario.avatar || 'https://placehold.co/100x100?text=B'} alt={match.outroUsuario.nome} />
                </div>
                <div className="match-card-info">
                  <p>Você e <strong>{match.outroUsuario.nome}</strong> deram match!</p>
                  <small>{new Date(match.dataMatch).toLocaleDateString()}</small>
                </div>
                <Button onClick={() => handleGoToChat(match.conversacaoId)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Conversar
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Matches;