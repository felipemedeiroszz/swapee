import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Entrando...");
    // Simula autenticação
    setTimeout(() => {
      setLoading(false);
      setStatus(null);
      navigate("/app");
    }, 900);
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center px-4" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <div className="particles" aria-hidden="true" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 animate-in fade-in-50 slide-in-from-top-2">
          <Link to="/" className="inline-block">
            <img src="/logoswapee.png" alt="Swapee" className="h-20 w-auto mx-auto" />
          </Link>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-2xl border border-pink-100 shadow-[0_8px_30px_rgba(255,77,124,0.15)] p-6 md:p-7 animate-in fade-in-50 slide-in-from-bottom-2">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Entrar</h1>
          <p className="text-gray-600 mb-6">Acesse sua conta para continuar</p>

          {status && (
            <div className="status-msg text-sm text-pink-900 px-3 py-2 mb-4">
              {status}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="field">
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <Mail className="icon w-4 h-4" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="voce@exemplo.com"
                className="input-fx mt-1 w-full border border-pink-200 pl-9 pr-3 py-2 focus:outline-none"
                onFocus={() => setStatus(null)}
              />
            </div>
            <div className="field">
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <Lock className="icon w-4 h-4" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-fx mt-1 w-full border border-pink-200 pl-9 pr-9 py-2 focus:outline-none"
                onFocus={() => setStatus(null)}
              />
              <button
                type="button"
                className="toggle p-1"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="btn-fx w-full bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
              onMouseEnter={() => setStatus(null)}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/70 text-gray-500">ou continue com</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setStatus('Redirecionando para o Google...')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.015] active:scale-[0.99]"
            >
              <img src="google.png" alt="Google" className="w-5 h-5 object-contain" />
              Entrar com Google
            </button>
            <button
              type="button"
              onClick={() => setStatus('Redirecionando para a Apple...')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.015] active:scale-[0.99]"
            >
              <img src="apple.png" alt="Apple" className="w-5 h-5 object-contain" />
              Entrar com Apple
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/esqueci-senha" className="text-sm font-medium text-pink-700 hover:underline transition-colors">
              Esqueci minha senha
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-700 flex justify-between">
            <span>Não tem conta?</span>
            <Link to="/cadastro" className="font-medium text-pink-700 hover:underline transition-colors">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
