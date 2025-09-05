import { useMemo, useState } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, X, Eye, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// removed Label in favor of floating labels
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
  const [cover, setCover] = useState('https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&h=400&fit=crop');
  const [viewMode, setViewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(100); // mock crop zoom
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
    // Aqui você implementaria a lógica para salvar as alterações
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
      toast.error(`Arquivo muito grande. Máximo ${maxSizeMB}MB.`);
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

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeMB = 8; // capas podem ser maiores
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido para a capa. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Capa muito grande. Máximo ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCover(event.target.result as string);
        toast.success('Pré-visualização da capa atualizada');
      }
    };
    reader.readAsDataURL(file);
  };

  const emailValid = useMemo(() => /.+@.+\..+/.test(formData.email), [formData.email]);
  const phoneValid = useMemo(() => formData.phone.replace(/\D/g, '').length >= 10, [formData.phone]);
  const nameValid = useMemo(() => formData.name.trim().length >= 2, [formData.name]);

  const addSocial = () => {
    setSocials((s) => [...s, { id: crypto.randomUUID(), label: 'Link', url: '' }]);
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
        {/* Capa + Ações */}
        <div className="mb-6 cover-wrap shadow-soft bg-card-soft">
          <div className="relative h-40 sm:h-56">
            <img src={cover} alt="Capa" className="w-full h-full object-cover" />
            <div className="cover-actions">
              <label htmlFor="cover-upload" className="cover-btn"><ImageIcon className="w-4 h-4"/>Alterar capa<input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} /></label>
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <button className="cover-btn"><Eye className="w-4 h-4"/>Pré-visualizar</button>
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
          </div>
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Modo {viewMode ? 'visualização' : 'edição'}</span>
              <Switch checked={viewMode} onCheckedChange={setViewMode} />
              <Button type="button" variant="outline" onClick={()=>{setFormData({ ...formData }); toast.success('Alterações descartadas');}}>Cancelar</Button>
              <Button type="submit">Salvar alterações</Button>
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

          {/* Seção: Sobre mim */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3">
              <h3 className="section-title">Sobre mim</h3>
              <p className="section-sub">Conte um pouco sobre você. {formData.bio.length}/200</p>
            </div>
            <div className="fl">
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} disabled={viewMode} rows={4} maxLength={200} placeholder=" " />
              <label htmlFor="bio">Descrição</label>
            </div>
          </section>

          {/* Seção: Redes sociais */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="section-title">Redes sociais e links</h3>
                <p className="section-sub">Adicione links para que outros conheçam mais sobre você.</p>
              </div>
              <Button type="button" variant="secondary" onClick={addSocial}><Plus className="w-4 h-4 mr-1"/>Adicionar</Button>
            </div>
            <div className="space-y-3">
              {socials.map((s)=> (
                <div key={s.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                  <div className="md:col-span-3 fl">
                    <Input value={s.label} onChange={(e)=>updateSocial(s.id, { label: e.target.value })} disabled={viewMode} placeholder=" " />
                    <label>Nome do link</label>
                  </div>
                  <div className="md:col-span-4 fl">
                    <Input value={s.url} onChange={(e)=>updateSocial(s.id, { url: e.target.value })} disabled={viewMode} placeholder=" " />
                    <label>URL</label>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={()=>removeSocial(s.id)} disabled={viewMode}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Ajuste de foto (crop simplificado) */}
          <section className="p-4 bg-card-soft section-card shadow-soft">
            <div className="mb-3">
              <h3 className="section-title">Ajustar foto de perfil</h3>
              <p className="section-sub">Ajuste o zoom para enquadrar melhor (preview ao lado).</p>
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
