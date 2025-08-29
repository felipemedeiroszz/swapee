import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula autenticação
    setTimeout(() => {
      setLoading(false);
      navigate("/app");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in-50 slide-in-from-top-2">
          <Link to="/" className="inline-block">
            <img src="/logoswapee.png" alt="Swapee" className="h-12 w-auto mx-auto" />
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl border border-pink-100 shadow-sm p-6 md:p-7 animate-in fade-in-50 slide-in-from-bottom-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Entrar</h1>
          <p className="text-gray-600 mb-6">Acesse sua conta para continuar</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="voce@exemplo.com"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-500 hover:opacity-90 text-white shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-700 flex justify-between">
            <span>Não tem conta?</span>
            <Link to="/cadastro" className="font-medium text-pink-700 hover:underline">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
