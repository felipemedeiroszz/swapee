import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { CreditCard, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-amber-100/40">
      <Header
        title="Pagamento"
        leftIcon={
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-accent/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-white ring-1 ring-amber-200 shadow flex items-center justify-center">
          <CreditCard className="w-7 h-7 text-amber-700" />
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold">Virar Premium</h1>
        <p className="mt-2 text-muted-foreground">
          Finalize sua assinatura Premium por <span className="font-semibold">$4,99/mês</span>.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            className="h-12 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff9900] text-gray-800 font-bold shadow hover:shadow-lg transition-transform hover:-translate-y-0.5"
            onClick={() => alert('Fluxo de pagamento aqui...')}
          >
            Pagar com Cartão
          </button>
          <button
            className="h-12 rounded-xl border border-amber-200 bg-white text-amber-900 font-semibold hover:bg-amber-50 transition"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
};

export default Payment;
