import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Crown, Stars, CheckCircle2, Heart, MessageCircle, ShieldCheck } from 'lucide-react';
import '../styles/premium.css';

const benefits = [
  {
    icon: <Heart className="w-5 h-5 text-amber-800" />,
    title: '30 Superlikes',
    desc: 'Destaque-se e aumente suas chances de match com 30 superlikes por mês.'
  },
  {
    icon: <Stars className="w-5 h-5 text-amber-800" />,
    title: 'Ver quem curtiu você',
    desc: 'Veja a lista de pessoas que curtiram seus itens, sem precisar esperar pelo match.'
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-amber-800" />,
    title: 'Mensagens Diretas',
    desc: 'Envie uma mensagem limitada antes do match para expressar interesse ou tirar dúvidas.'
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-amber-800" />,
    title: 'Verificação de Perfil',
    desc: 'Ganhe o selo de verificado e aumente credibilidade e segurança em suas trocas.'
  },
];

const Premium = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-amber-100/40">
      <Header title="Premium" />

      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        {/* Hero */}
        <section className="text-center animate-in fade-in-50">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs ring-1 ring-amber-200 shadow">
            <Crown className="w-4 h-4 text-amber-700" />
            Experiência exclusiva
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold">
            Torne-se <span className="bg-gradient-to-r from-[#ffd700] to-[#ff9900] bg-clip-text text-transparent">Premium</span>
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Desbloqueie recursos avançados para acelerar suas trocas e doações.
          </p>
        </section>

        {/* Benefits */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50 slide-in-from-bottom-2">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur ring-1 ring-amber-100 shadow-[0_8px_30px_rgba(251,191,36,0.12)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.18)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background:
                       'radial-gradient(800px circle at var(--x,50%) var(--y,50%), rgba(255,215,0,0.10), transparent 40%)'
                   }}
              />
              <div className="p-4 flex items-start gap-3 relative">
                <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-amber-100 text-amber-800">
                  {b.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{b.title}</h3>
                    {b.title.includes('Verificação') && (
                      <img className="w-4 h-4 rounded-full" src="/verificado.gif" alt="Selo verificado" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                </div>
                <CheckCircle2 className="ml-auto w-5 h-5 text-amber-700 opacity-80" />
              </div>
            </div>
          ))}
        </section>

        {/* Secondary CTA */}
        <div className="mt-10 text-center">
          <button
            className="premium-button"
            onClick={() => navigate('/pagamento')}
            aria-label="Virar Premium agora por $4,99/mês"
          >
            <span className="sparkle-strip" aria-hidden="true"></span>
            <span className="premium-left">
              <Crown className="w-5 h-5 text-amber-800" />
              <span className="premium-title">
                <span className="line-top">Virar Premium agora</span>
                <span className="line-bottom">Plano mensal</span>
              </span>
            </span>
            <span className="premium-price">$4,99/mês</span>
            <span className="premium-right">
              <Stars className="w-5 h-5 text-amber-800" />
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Premium;
