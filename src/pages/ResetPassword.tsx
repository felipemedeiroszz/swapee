import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPassword, ApiError } from "@/services/auth";
import "../styles/login.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [passwordReset, setPasswordReset] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!tokenFromUrl) {
      setErrors({ ...errors, token: "Token de redefinição não encontrado. Verifique o link do email." });
      return;
    }
    
    setLoading(true);
    setStatus("Redefinindo senha...");
    
    try {
      await resetPassword({
        token: tokenFromUrl,
        email,
        novaSenha: password,
      });
      
      setLoading(false);
      setStatus(null);
      setPasswordReset(true);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || "Erro ao redefinir senha. Verifique o token e tente novamente.";
      setStatus(errorMessage);
      setLoading(false);
    }
  };

  if (passwordReset) {
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
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Senha Redefinida!</h1>
              <p className="text-gray-600 mb-6">
                Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
              </p>
              
              <Link to="/login">
                <Button className="w-full bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white">
                  Ir para Login
                </Button>
              </Link>
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
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Redefinir Senha</h1>
            <p className="text-gray-600">Digite seu email e sua nova senha</p>
          </div>

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({...prev, email: ''}));
                  }
                }}
                required
                placeholder="voce@exemplo.com"
                className={`input-fx mt-1 w-full border pl-9 pr-3 py-2 focus:outline-none ${
                  errors.email ? 'border-red-300' : 'border-pink-200'
                }`}
                onFocus={() => setStatus(null)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="field">
              <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
              <Lock className="icon w-4 h-4" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({...prev, password: ''}));
                  }
                }}
                required
                placeholder="••••••••"
                className={`input-fx mt-1 w-full border pl-9 pr-9 py-2 focus:outline-none ${
                  errors.password ? 'border-red-300' : 'border-pink-200'
                }`}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <div className="field">
              <label className="block text-sm font-medium text-gray-700">Repetir Nova Senha</label>
              <Lock className="icon w-4 h-4" aria-hidden="true" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({...prev, confirmPassword: ''}));
                  }
                }}
                required
                placeholder="••••••••"
                className={`input-fx mt-1 w-full border pl-9 pr-9 py-2 focus:outline-none ${
                  errors.confirmPassword ? 'border-red-300' : 'border-pink-200'
                }`}
                onFocus={() => setStatus(null)}
              />
              <button
                type="button"
                className="toggle p-1"
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="btn-fx w-full bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
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

export default ResetPassword;