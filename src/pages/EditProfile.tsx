import { useMemo, useState } from 'react';
import { ArrowLeft, Camera, X, Eye, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import '../styles/profile-edit.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    phone: '(11) 98765-4321',
    location: 'São Paulo, SP',
    bio: 'Apaixonada por moda sustentável e trocas conscientes.',
  });
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face');
  const [viewMode, setViewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [socials, setSocials] = useState<{ id: string; label: string; url: string }[]>([
    { id: 's1', label: 'Instagram', url: 'https://instagram.com/maria' },
  ]);
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados atualizados:', formData);
    navigate('/perfil');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeMB = 5;
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Imagem muito grande. Máximo ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        toast.success('Pré-visualização atualizada');
      }
    };
    reader.readAsDataURL(file);
  };

  const emailValid = useMemo(() => /.+@.+\..+/.test(formData.email), [formData.email]);
  const phoneValid = useMemo(() => formData.phone.replace(/\D/g, '').length >= 10, [formData.phone]);
  const nameValid = useMemo(() => formData.name.trim().length >= 2, [formData.name]);

  const addSocial = () => {
    const newId = `s${Date.now()}`;
    setSocials((s) => [...s, { id: newId, label: '', url: '' }]);
  };
  const updateSocial = (id: string, patch: Partial<{ label: string; url: string }>) => {
    setSocials((s) => s.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const removeSocial = (id: string) => setSocials((s) => s.filter((it) => it.id !== id));

  return (
    <div className="min-h-screen profile-shell bg-gradient-to-br from-[var(--pink-100)]/35 via-white to-[var(--pink-100)]/25">
      <Header 
        title="Editar Perfil"
        leftIcon={
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-accent/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      />
      
      <main className="pt-20 pb-28 lg:pb-24 px-4 max-w-4xl mx-auto">
        {/* Avatar + Ações */}
        <div className="mb-6">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-4">
                <Eye className="w-4 h-4 mr-2"/>Pré-visualizar perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="preview-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Pré-visualização do perfil</DialogTitle>
              </DialogHeader>
              <div>
                <div className="preview-header">
                  <div className="flex items-center gap-3">
                    <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-white">{formData.name}</div>
                      <div className="text-white/80 text-sm">{formData.location}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{formData.bio}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de Perfil + Edit/View toggle */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="avatar-wrap">
              <img src={avatar} alt="Foto de perfil" className="w-32 h-32 rounded-full object-cover" />
              <label className="avatar-edit cursor-pointer" htmlFor="avatar-upload"><Camera className="w-4 h-4"/></label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button type="button" className="avatar-remove" onClick={()=>setAvatar('')}><X className="w-4 h-4"/></button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Modo visualização</span>
              <Switch checked={viewMode} onCheckedChange={setViewMode} />
            </div>
          </div>

          {/* Seção: Informações Pessoais */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3">
              <h3 className="section-title">Informações pessoais</h3>
              <p className="section-sub">Atualize seu nome e dados básicos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="fl">
                <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={viewMode} placeholder=" " className={nameValid ? 'input-ok' : ''} />
                <label htmlFor="name">Nome *</label>
                {!nameValid && (<p className="help text-red-600 mt-1">Informe um nome válido.</p>)}
              </div>
              <div className="fl">
                <Input id="location" name="location" value={formData.location} onChange={handleChange} disabled={viewMode} placeholder=" " />
                <label htmlFor="location">Localização</label>
              </div>
            </div>
          </section>

          {/* Seção: Contato */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3">
              <h3 className="section-title">Dados de contato</h3>
              <p className="section-sub">Essas informações ajudam outros usuários a entrar em contato.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="fl">
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={viewMode} placeholder=" " className={emailValid ? 'input-ok' : 'input-err'} />
                <label htmlFor="email">E-mail *</label>
                {!emailValid && (<p className="help text-red-600 mt-1">E-mail inválido.</p>)}
              </div>
              <div className="fl">
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={viewMode} placeholder=" " className={phoneValid ? 'input-ok' : 'input-err'} />
                <label htmlFor="phone">Telefone *</label>
                {!phoneValid && (<p className="help text-red-600 mt-1">Informe um telefone válido.</p>)}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="privacy-row">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[var(--pink-800)]"/><span>Mostrar e-mail no perfil</span></div>
                <Switch checked={privacy.showEmail} onCheckedChange={(v)=>setPrivacy(p=>({...p, showEmail:v}))} />
              </div>
              <div className="privacy-row">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[var(--pink-800)]"/><span>Mostrar telefone no perfil</span></div>
                <Switch checked={privacy.showPhone} onCheckedChange={(v)=>setPrivacy(p=>({...p, showPhone:v}))} />
              </div>
              <div className="privacy-row">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[var(--pink-800)]"/><span>Mostrar localização aproximada</span></div>
                <Switch checked={privacy.showLocation} onCheckedChange={(v)=>setPrivacy(p=>({...p, showLocation:v}))} />
              </div>
            </div>
          </section>

          {/* Seção: Bio */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3">
              <h3 className="section-title">Sobre você</h3>
              <p className="section-sub">Conte um pouco sobre seus interesses e o que você procura.</p>
            </div>
            <div className="fl">
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} disabled={viewMode} placeholder=" " rows={3} />
              <label htmlFor="bio">Biografia</label>
            </div>
          </section>

          {/* Seção: Redes Sociais */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="section-title">Redes sociais</h3>
                <p className="section-sub">Adicione links para suas redes sociais (opcional).</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addSocial} disabled={viewMode}>
                <Plus className="w-4 h-4 mr-1"/>Adicionar
              </Button>
            </div>
            <div className="space-y-3">
              {socials.map((social) => (
                <div key={social.id} className="flex gap-2">
                  <div className="fl flex-1">
                    <Input value={social.label} onChange={(e)=>updateSocial(social.id, {label: e.target.value})} disabled={viewMode} placeholder=" " />
                    <label>Rede social</label>
                  </div>
                  <div className="fl flex-[2]">
                    <Input value={social.url} onChange={(e)=>updateSocial(social.id, {url: e.target.value})} disabled={viewMode} placeholder=" " />
                    <label>URL</label>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={()=>removeSocial(social.id)} disabled={viewMode}>
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Ajustes de Foto */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3">
              <h3 className="section-title">Ajustes de foto</h3>
              <p className="section-sub">Ajuste o zoom da sua foto de perfil.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <input type="range" min={50} max={150} step={1} value={zoom} onChange={(e)=>setZoom(parseInt(e.target.value))} />
              <div className="md:col-span-2 flex items-center gap-3">
                <div className="w-24 h-24 overflow-hidden rounded-full border"><img src={avatar} style={{ transform: `scale(${zoom/100})` }} className="w-full h-full object-cover"/></div>
                <span className="text-sm text-muted-foreground">Zoom: {zoom}%</span>
              </div>
            </div>
          </section>

          {/* Desktop actions */}
          <div className="hidden lg:flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={()=>toast.message('Edições canceladas')}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
          </div>

          {/* Sticky mobile actions */}
          <div className="sticky-actions lg:hidden">
            <Button type="button" variant="outline" className="flex-1" onClick={()=>toast.message('Edições canceladas')}>Cancelar</Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;