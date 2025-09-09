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
            <img src="/logoswapee.png" alt="Swapee" className="h-12 w-auto mx-auto" />
          </Link>
          <div className="mt-3 text-pink-700 font-semibold">
            <span className="typing">Bem-vindo de volta</span>
          </div>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-pink-100 rounded-lg bg-pink-50 text-pink-700 font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 20.8055 10.0415Z" fill="#FF4D7C"/>
              </svg>
              Entrar com Google
            </button>
            <button
              type="button"
              onClick={() => setStatus('Redirecionando para a Apple...')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-pink-100 rounded-lg bg-pink-100 text-pink-800 font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5C18.617 20.3105 19.048 21.218 19.69 21.728C19.1715 22.415 18.4695 22.9985 17.391 22.9985C16.3125 22.9985 15.765 22.4795 14.8165 22.4795C13.8355 22.4795 13.2565 23 12.235 23C11.191 23 10.45 22.456 9.913 21.786C7.891 19.288 6.5425 15.87 7.405 11.44C8.17 7.521 11.1535 5.3195 13.939 5.3195C15.2995 5.3195 16.4705 6.0225 17.2765 6.0225C18.0235 6.0225 19.2685 5.245 20.765 5.3195C21.696 5.3445 23.5 6.041 23.5 8.555C23.5 9.94 23.415 10.9085 23.3 11.8965H18.71V19.5Z" fill="#D6336C"/>
                <path d="M18.205 2.5C18.205 3.7525 17.4 4.9835 16.29 5.2305C15.2555 4.9005 14.38 3.9995 14.38 2.5C14.38 1.47 15.02 0.5 15.99 0.5C17.17 0.5 18.075 1.517 18.205 2.5Z" fill="#D6336C"/>
              </svg>
              Entrar com Apple
            </button>
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
