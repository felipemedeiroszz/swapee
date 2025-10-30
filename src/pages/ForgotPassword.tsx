import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPassword, ApiError } from "@/services/auth";
import "../styles/login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Enviando email de recuperação...");
    setError(null);
    
    try {
      await forgotPassword({ email });
      setLoading(false);
      setStatus(null);
      setEmailSent(true);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || "Erro ao enviar email. Tente novamente.";
      setError(errorMessage);
      setStatus(null);
      setLoading(false);
    }
  };

  if (emailSent) {
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
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Email Enviado!</h1>
              <p className="text-gray-600 mb-6">
                Enviamos um link de recuperação para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e spam.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Enviar para outro email
                </Button>
                
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white">
                    Voltar ao Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center mb-6">
            <Link to="/login" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Esqueci minha senha</h1>
              <p className="text-gray-600">Digite seu email para receber o link de recuperação</p>
            </div>
          </div>

          {status && (
            <div className="status-msg text-sm text-pink-900 px-3 py-2 mb-4">
              {status}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {error}
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
            
            <Button
              type="submit"
              disabled={loading}
              className="btn-fx w-full bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-pink-700 hover:underline transition-colors">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;