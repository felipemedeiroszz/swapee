import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de cadastro
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  const isEmailValid = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email), [form.email]);
  const isPasswordValid = useMemo(() => form.senha.length >= 6, [form.senha]);
  const doPasswordsMatch = useMemo(() => form.senha === form.confirmarSenha && form.confirmarSenha.length > 0, [form.senha, form.confirmarSenha]);

  const isFormValid = useMemo(() => {
    return form.nome.trim() && isEmailValid && isPasswordValid && doPasswordsMatch;
  }, [form.nome, isEmailValid, isPasswordValid, doPasswordsMatch]);

  const markTouched = (name: string) => setTouched((t) => ({ ...t, [name]: true }));

  return (
    <div className="signup-bg flex items-center justify-center px-4" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <div className="signup-particles" aria-hidden="true" />
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8 animate-in fade-in-50 slide-in-from-top-2">
          <Link to="/" className="inline-block">
            <img src="/logoswapee.png" alt="Swapee" className="h-20 w-auto mx-auto" />
          </Link>
        </div>

        <div className="signup-card p-6 md:p-8 animate-in fade-in-50 slide-in-from-bottom-2">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Criar conta</h1>
          <p className="text-gray-600 mb-6">Preencha seus dados para começar</p>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="field seq-in" style={{ animationDelay: '50ms' }}>
              <label className="block text-sm font-medium text-gray-700">Nome completo</label>
              <User className="icon w-4 h-4" aria-hidden="true" />
              <input
                name="nome"
                value={form.nome}
                onChange={onChange}
                onBlur={() => markTouched('nome')}
                required
                placeholder="Seu nome completo"
                className={`input-fx mt-1 w-full border ${touched.nome && !form.nome.trim() ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
              />
            </div>

            <div className="field seq-in" style={{ animationDelay: '100ms' }}>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <Mail className="icon w-4 h-4" aria-hidden="true" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                onBlur={() => markTouched('email')}
                required
                placeholder="voce@exemplo.com"
                className={`input-fx mt-1 w-full border ${touched.email && !isEmailValid ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
              />
              {touched.email && !isEmailValid && form.email && (
                <p className="mt-1 text-xs text-red-600">Digite um e-mail válido</p>
              )}
            </div>

            <div className="field seq-in" style={{ animationDelay: '150ms' }}>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <Lock className="icon w-4 h-4" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                value={form.senha}
                onChange={onChange}
                onBlur={() => markTouched('senha')}
                required
                placeholder="Mínimo 6 caracteres"
                className={`input-fx mt-1 w-full border ${touched.senha && !isPasswordValid ? 'input-error' : 'border-pink-200'} pl-9 pr-10 py-2 focus:outline-none`}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {touched.senha && !isPasswordValid && form.senha && (
                <p className="mt-1 text-xs text-red-600">A senha deve ter pelo menos 6 caracteres</p>
              )}
            </div>

            <div className="field seq-in" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-medium text-gray-700">Confirmar senha</label>
              <Lock className="icon w-4 h-4" aria-hidden="true" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarSenha"
                value={form.confirmarSenha}
                onChange={onChange}
                onBlur={() => markTouched('confirmarSenha')}
                required
                placeholder="Digite a senha novamente"
                className={`input-fx mt-1 w-full border ${touched.confirmarSenha && !doPasswordsMatch ? 'input-error' : 'border-pink-200'} pl-9 pr-10 py-2 focus:outline-none`}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {touched.confirmarSenha && !doPasswordsMatch && form.confirmarSenha && (
                <p className="mt-1 text-xs text-red-600">As senhas não coincidem</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="btn-fx w-full bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white hover:shadow-lg"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-gray-700 flex justify-between">
            <span>Já tem uma conta?</span>
            <Link to="/login" className="font-medium text-pink-700 hover:underline">Entrar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
