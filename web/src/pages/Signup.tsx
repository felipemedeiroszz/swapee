import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Hash, Phone, Mail, MapPin, Home, Hash as HashIcon, Landmark, Building2, Image as ImageIcon, X, Info } from "lucide-react";
import "../styles/signup.css";

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const dropRef = useRef<HTMLDivElement | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "telefone") v = maskPhone(value);
    if (name === "cep") v = maskCEP(value);
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
      return;
    }
    setLoading(true);
    // Simulação de cadastro
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Por favor, selecione uma imagem válida.");
      return;
    }
    // Limite ~5MB
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Imagem muito grande (máx. 5MB).");
      return;
    }
    setPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
  };

  const onDropHandlers = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dropRef.current?.classList.add("dragover");
    },
    onDragLeave: () => {
      dropRef.current?.classList.remove("dragover");
    },
    onDrop: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dropRef.current?.classList.remove("dragover");
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const fakeEvt = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        onPhotoChange(fakeEvt);
      }
    }
  };

  const maskPhone = (v: string) => {
    return v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2")
      .slice(0, 15);
  };
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/(\d{5})(\d{3}).*/, "$1-$2");
  const isEmailValid = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email), [form.email]);

  const stepPercent = useMemo(() => (currentStep - 1) * 50, [currentStep]);
  const nextDisabled = useMemo(() => {
    if (currentStep === 1) {
      return !(form.nome && form.idade && form.telefone && isEmailValid);
    }
    if (currentStep === 2) {
      return !(form.cep && form.rua && form.numero && form.bairro && form.cidade);
    }
    return false;
  }, [currentStep, form, isEmailValid]);

  const markTouched = (name: string) => setTouched((t) => ({ ...t, [name]: true }));

  return (
    <div className="signup-bg flex items-center justify-center px-4" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <div className="signup-particles" aria-hidden="true" />
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8 animate-in fade-in-50 slide-in-from-top-2">
          <Link to="/" className="inline-block">
            <img src="/logoswapee.png" alt="Swapee" className="h-12 w-auto mx-auto" />
          </Link>
        </div>

        <div className="signup-card p-6 md:p-8 animate-in fade-in-50 slide-in-from-bottom-2">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Criar conta</h1>
          <p className="text-gray-600 mb-6">Preencha seus dados para começar</p>

          {/* Progress */}
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stepPercent}%` }} />
            </div>
            <div className="progress-steps">
              <div className={`step-pill ${currentStep === 1 ? 'active' : ''}`}>Dados Pessoais</div>
              <div className={`step-pill ${currentStep === 2 ? 'active' : ''}`}>Endereço</div>
              <div className={`step-pill ${currentStep === 3 ? 'active' : ''}`}>Foto</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 field seq-in" style={{ animationDelay: '50ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <User className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={onChange}
                    onBlur={() => markTouched('nome')}
                    required
                    placeholder="Seu nome completo"
                    className={`input-fx mt-1 w-full border ${touched.nome && !form.nome ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                  <div className="help mt-1 flex items-center gap-1"><Info className="w-3 h-3" /> Use seu nome real.</div>
                </div>
                <div className="field seq-in" style={{ animationDelay: '100ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Idade</label>
                  <Hash className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    type="number"
                    name="idade"
                    value={form.idade}
                    onChange={onChange}
                    onBlur={() => markTouched('idade')}
                    required
                    placeholder="18"
                    className={`input-fx mt-1 w-full border ${touched.idade && !form.idade ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
                <div className="field seq-in" style={{ animationDelay: '150ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <Phone className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    type="tel"
                    name="telefone"
                    value={form.telefone}
                    onChange={onChange}
                    onBlur={() => markTouched('telefone')}
                    required
                    placeholder="(11) 99999-9999"
                    className={`input-fx mt-1 w-full border ${touched.telefone && form.telefone.length < 14 ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
                <div className="md:col-span-2 field seq-in" style={{ animationDelay: '200ms' }}>
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
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 field seq-in" style={{ animationDelay: '50ms' }}>
                  <label className="block text-sm font-medium text-gray-700">CEP</label>
                  <MapPin className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="cep"
                    value={form.cep}
                    onChange={onChange}
                    onBlur={() => markTouched('cep')}
                    required
                    placeholder="00000-000"
                    className={`input-fx mt-1 w-full border ${touched.cep && form.cep.length < 9 ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
                <div className="md:col-span-2 field seq-in" style={{ animationDelay: '100ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Rua</label>
                  <Home className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="rua"
                    value={form.rua}
                    onChange={onChange}
                    onBlur={() => markTouched('rua')}
                    required
                    placeholder="Nome da rua"
                    className={`input-fx mt-1 w-full border ${touched.rua && !form.rua ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
                <div className="field seq-in" style={{ animationDelay: '150ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Número</label>
                  <HashIcon className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="numero"
                    value={form.numero}
                    onChange={onChange}
                    onBlur={() => markTouched('numero')}
                    required
                    placeholder="Nº"
                    className={`input-fx mt-1 w-full border ${touched.numero && !form.numero ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
                <div className="field seq-in" style={{ animationDelay: '200ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Complemento</label>
                  <Building2 className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="complemento"
                    value={form.complemento}
                    onChange={onChange}
                    placeholder="Apto, bloco, etc."
                    className="input-fx mt-1 w-full border border-pink-200 pl-9 pr-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="field seq-in" style={{ animationDelay: '250ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Bairro</label>
                  <Landmark className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="bairro"
                    value={form.bairro}
                    onChange={onChange}
                    onBlur={() => markTouched('bairro')}
                    required
                    placeholder="Seu bairro"
                    className={`input-fx mt-1 w-full border ${touched.bairro && !form.bairro ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
                <div className="field seq-in" style={{ animationDelay: '300ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Cidade</label>
                  <Landmark className="icon w-4 h-4" aria-hidden="true" />
                  <input
                    name="cidade"
                    value={form.cidade}
                    onChange={onChange}
                    onBlur={() => markTouched('cidade')}
                    required
                    placeholder="Sua cidade"
                    className={`input-fx mt-1 w-full border ${touched.cidade && !form.cidade ? 'input-error' : 'border-pink-200'} pl-9 pr-3 py-2 focus:outline-none`}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 gap-4">
                <div className="seq-in" style={{ animationDelay: '50ms' }}>
                  <label className="block text-sm font-medium text-gray-700">Foto do rosto (opcional)</label>
                  <div
                    ref={dropRef}
                    className="dropzone mt-2 p-4 flex items-center gap-4"
                    {...onDropHandlers}
                  >
                    <div className="preview">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Prévia da foto" className="h-full w-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white text-pink-600 text-xs">Prévia</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-pink-600" /> Arraste e solte sua foto aqui ou</p>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-pink-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:shadow hover:-translate-y-0.5 hover:border-pink-300 mt-2">
                        <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
                        <span>Escolher imagem</span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500">PNG ou JPG até 5MB</p>
                      {photoError && <p className="mt-1 text-xs text-red-600">{photoError}</p>}
                    </div>
                    {photoPreview && (
                      <button type="button" className="text-red-700 text-xs inline-flex items-center gap-1" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>
                        <X className="w-3 h-3" /> Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="btn-fx border-pink-200 text-pink-700 hover:bg-pink-50"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
              >
                Voltar
              </Button>
              <Button
                type={currentStep === 3 ? "submit" : "button"}
                disabled={loading || nextDisabled}
                className="btn-fx bg-gradient-to-r from-[#ff6b93] via-[#ff4d7c] to-[#ff9ab0] text-white hover:shadow-lg"
                onClick={currentStep === 3 ? undefined : () => setCurrentStep((s) => Math.min(3, s + 1))}
              >
                {currentStep === 3 ? (loading ? "Criando conta..." : "Criar conta") : "Avançar"}
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
