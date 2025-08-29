import { useEffect, useState, useCallback } from "react";
import { LogIn, Menu, HeartHandshake, Recycle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

const sections = [
  { id: "troca", label: "Troca" },
  { id: "doacao", label: "Doação" },
  { id: "sobre", label: "Sobre nós" },
  { id: "contato", label: "Contato" },
];

const Landing = () => {
  const [active, setActive] = useState<string>("troca");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [heroOffset, setHeroOffset] = useState(0);

  // Smooth scroll with header offset via scroll-margin on sections
  const onNavClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  }, []);

  // Observe sections to set active link and reveal animations once
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(visible.target.id);
          setVisible((prev) => {
            const next = new Set(prev);
            next.add(visible.target.id);
            return next;
          });
        }
      },
      { root: null, threshold: [0.2, 0.5, 0.8], rootMargin: "-20% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Scroll progress + subtle parallax for hero image
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
      setHeroOffset(scrollTop * 0.06); // parallax factor
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <div className="w-full h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-500" />
      {/* Scroll progress */}
      <div className="fixed left-0 top-0 h-1 z-50 bg-pink-600/80 transition-[width] duration-200" style={{ width: `${progress}%` }} />

      {/* Nav */}
      <header className="sticky top-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-2">
            <img src="/logoswapee.png" alt="Swapee" className="h-6 w-auto" />
          </div>
          <nav className="hidden sm:flex items-center gap-6 font-semibold">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => onNavClick(s.id)}
                className={`inline-block border-b-2 transition ${
                  active === s.id
                    ? "text-pink-700 border-pink-600"
                    : "text-pink-700/80 hover:text-pink-700 border-transparent hover:border-pink-600"
                }`}
              >
                {s.label}
              </button>
            ))}
            <Link to="/login" className="ml-2">
              <Button className="inline-flex items-center gap-1 rounded-full border border-pink-200 px-3 py-1 text-sm font-semibold text-black hover:text-white hover:bg-pink-600 shadow-sm transition">
                Login <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
          {/* Mobile: hamburger + drawer */}
          <div className="sm:hidden flex items-center gap-2">
            <Link to="/login" className="text-black hover:text-pink-700 flex items-center gap-1">
              Login <LogIn className="h-5 w-5" />
            </Link>
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Abrir menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="top-0 bottom-auto rounded-t-none rounded-b-[10px] animate-in slide-in-from-top-4 duration-300">
                <DrawerHeader>
                  <DrawerTitle className="text-left">Menu</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-6 flex flex-col gap-4">
                  {sections.map((s) => (
                    <DrawerClose asChild key={s.id}>
                      <button
                        onClick={() => onNavClick(s.id)}
                        className={`text-lg text-left ${active === s.id ? "text-pink-700" : "text-gray-700"}`}
                      >
                        {s.label}
                      </button>
                    </DrawerClose>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="order-2 md:order-1 animate-in fade-in-50 slide-in-from-left-4 duration-700">
            <h1 className="text-[40px] sm:text-[52px] font-extrabold leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">Doe</span> ou troque
              <br />
              seu Item que <span className="bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">Não</span>
              <br />
              usa mais!
            </h1>
          </div>
          <div className="order-1 md:order-2 flex justify-center animate-in fade-in-50 slide-in-from-right-4 duration-700">
            {/* GIF do celular */}
            <img
              src="/cell.gif"
              alt="Demonstração do app"
              className="w-72 md:w-96 h-auto drop-shadow-xl transition-transform duration-500 will-change-transform hover:scale-[1.03]"
              style={{ transform: `translateY(${heroOffset * 0.4}px)` }}
            />
          </div>
        </div>
      </section>

      {/* Sections */}
      <section id="troca" className="max-w-6xl mx-auto px-4 mt-8 sm:mt-10 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold inline-block">
            Troca
            <span className="block h-1 bg-gradient-to-r from-pink-600 to-fuchsia-400 mt-2 rounded-full" />
          </h2>
        </div>
        <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-pink-50/60 border border-pink-100 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-700 ${visible.has("troca") ? "animate-in fade-in-50 slide-in-from-bottom-2" : "opacity-0 translate-y-2"}`}>
          <div className="text-lg leading-relaxed text-gray-700">
            <p>
              Na seção de <span className="font-semibold text-pink-600">Troca</span> você encontra
              pessoas interessadas em dar um novo destino aos seus itens. Combine trocas de forma
              prática e segura, reduzindo o desperdício e fortalecendo a economia colaborativa.
            </p>
            <div className="mt-6">
              <Link to="/app">
                <Button className="bg-gradient-to-r from-pink-600 to-fuchsia-500 hover:opacity-90 text-white shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(236,72,153,0.35)]">
                  Começar troca
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center gap-6">
            <img
              src="/bolsa (1).png"
              alt="Bolsa"
              className="h-36 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
            />
            <img
              src="/macbook.png"
              alt="Macbook"
              className="h-36 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
            />
          </div>
        </div>
      </section>

      <section id="doacao" className="max-w-6xl mx-auto px-4 mt-16 sm:mt-20 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold inline-block">
            Doação
            <span className="block h-1 w-56 mx-auto bg-gradient-to-r from-pink-600 to-fuchsia-400 mt-2 rounded-full" />
          </h2>
        </div>
        <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-white to-pink-50 border border-pink-100 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-700 ${visible.has("doacao") ? "animate-in fade-in-50 slide-in-from-bottom-2" : "opacity-0 translate-y-2"}`}>
          <div className="order-2 md:order-1 text-lg leading-relaxed text-gray-700">
            <p>
              Doe itens em bom estado para quem precisa. Nós facilitamos o encontro entre quem
              quer ajudar e quem pode se beneficiar, com transparência e praticidade.
            </p>
            <div className="mt-6">
              <Link to="/app">
                <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Fazer doação
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <img src="/tenis (1).png" alt="Tênis doado" className="w-48 md:w-56 h-auto drop-shadow transition-transform duration-300 hover:-translate-y-1" />
          </div>
        </div>
      </section>

      {/* Sobre nós */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 mt-16 sm:mt-24 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold inline-block">
            Sobre nós
            <span className="block h-1 w-40 mx-auto bg-gradient-to-r from-pink-600 to-fuchsia-400 mt-2 rounded-full" />
          </h2>
        </div>
        <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start transition-all duration-700 ${visible.has("sobre") ? "animate-in fade-in-50 slide-in-from-bottom-2" : "opacity-0 translate-y-2"}`}>
          <p className="text-lg leading-relaxed text-gray-700">
            Acreditamos que cada item merece uma segunda chance. O Swapee conecta pessoas
            para <span className="font-semibold text-pink-600">trocarem</span> e
            <span className="font-semibold text-pink-600"> doarem</span> com praticidade,
            incentivando o consumo consciente e a sustentabilidade.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <li className="group flex flex-col items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/50 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-pink-100 text-pink-700">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <span className="font-semibold">Comunidade</span>
              <span className="text-sm text-gray-600">Conexões que geram impacto.</span>
            </li>
            <li className="group flex flex-col items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/50 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-pink-100 text-pink-700">
                <Recycle className="w-5 h-5" />
              </span>
              <span className="font-semibold">Sustentável</span>
              <span className="text-sm text-gray-600">Menos descarte, mais reuso.</span>
            </li>
            <li className="group flex flex-col items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/50 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-pink-100 text-pink-700">
                <Users className="w-5 h-5" />
              </span>
              <span className="font-semibold">Simples</span>
              <span className="text-sm text-gray-600">Fácil de usar e gratuito.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="max-w-6xl mx-auto px-4 mt-16 sm:mt-24 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold inline-block">
            Contato
            <span className="block h-1 w-40 mx-auto bg-gradient-to-r from-pink-600 to-fuchsia-400 mt-2 rounded-full" />
          </h2>
        </div>
        <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start transition-all duration-700 ${visible.has("contato") ? "animate-in fade-in-50 slide-in-from-bottom-2" : "opacity-0 translate-y-2"}`}>
          {/* Formulário */}
          <form className="bg-white border border-pink-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                placeholder="voce@exemplo.com"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mensagem</label>
              <textarea
                rows={4}
                placeholder="Como podemos ajudar?"
                className="mt-1 w-full rounded-md border border-pink-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <Button className="bg-gradient-to-r from-pink-600 to-fuchsia-500 hover:opacity-90 text-white shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              Enviar mensagem
            </Button>
          </form>
          {/* Informações */}
          <div className="bg-gradient-to-br from-white to-pink-50 border border-pink-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-gray-700">
              Fale com a gente por e-mail, telefone ou redes sociais. Responderemos em breve!
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li><span className="font-semibold">E-mail:</span> contato@swapee.com</li>
              <li><span className="font-semibold">Telefone:</span> +55 (11) 99999-9999</li>
              <li><span className="font-semibold">Endereço:</span> São Paulo, SP</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a className="px-3 py-2 rounded-md border border-pink-200 hover:bg-pink-100 transition" href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a className="px-3 py-2 rounded-md border border-pink-200 hover:bg-pink-100 transition" href="#" target="_blank" rel="noreferrer">Facebook</a>
              <a className="px-3 py-2 rounded-md border border-pink-200 hover:bg-pink-100 transition" href="#" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-pink-100 bg-pink-50/40">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logoswapee.png" alt="Swapee" className="h-5 w-auto" />
              <span className="font-semibold">Swapee</span>
            </div>
            <p>Doe ou troque itens e ajude a construir um mundo mais sustentável.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Contato</h3>
            <ul className="space-y-1">
              <li><a className="hover:text-pink-700" href="mailto:contato@swapee.com">contato@swapee.com</a></li>
              <li><a className="hover:text-pink-700" href="tel:+5511999999999">+55 (11) 99999-9999</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Redes</h3>
            <ul className="space-y-1">
              <li><a className="hover:text-pink-700" href="#" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a className="hover:text-pink-700" href="#" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a className="hover:text-pink-700" href="#" target="_blank" rel="noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} Swapee. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
};

export default Landing;
