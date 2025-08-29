import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    telefone: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: ""
  });
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 animate-in fade-in-50 slide-in-from-top-2">
          <Link to="/" className="inline-block">
            <img src="/logoswapee.png" alt="Swapee" className="h-12 w-auto mx-auto" />
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl border border-pink-100 shadow-sm p-6 md:p-7 animate-in fade-in-50 slide-in-from-bottom-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar conta</h1>
          <p className="text-gray-600 mb-6">Preencha seus dados para começar</p>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                name="nome"
                value={form.nome}
                onChange={onChange}
                required
                placeholder="Seu nome completo"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Idade</label>
              <input
                type="number"
                name="idade"
                value={form.idade}
                onChange={onChange}
                required
                placeholder="18"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={onChange}
                required
                placeholder="(11) 99999-9999"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="voce@exemplo.com"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                name="cep"
                value={form.cep}
                onChange={onChange}
                required
                placeholder="00000-000"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Rua</label>
              <input
                name="rua"
                value={form.rua}
                onChange={onChange}
                required
                placeholder="Nome da rua"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                name="numero"
                value={form.numero}
                onChange={onChange}
                required
                placeholder="Nº"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                name="complemento"
                value={form.complemento}
                onChange={onChange}
                placeholder="Apto, bloco, etc."
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                name="bairro"
                value={form.bairro}
                onChange={onChange}
                required
                placeholder="Seu bairro"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                name="cidade"
                value={form.cidade}
                onChange={onChange}
                required
                placeholder="Sua cidade"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-500 hover:opacity-90 text-white shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
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
