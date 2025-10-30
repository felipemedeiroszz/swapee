import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { createItem } from "@/services/items";
import { ApiError } from "@/lib/api";
import { pickPhotos } from "@/lib/camera";

const MAX_IMAGES = 6;

const schema = z.object({
  title: z.string().min(3, "Informe um título (min. 3 caracteres)"),
  description: z.string().min(10, "Descreva melhor seu item (min. 10 caracteres)"),
  category: z.string({ required_error: "Selecione uma categoria" }),
  subcategory: z.string({ required_error: "Selecione uma subcategoria" }),
  price: z
    .string()
    .refine((v) => v === "" || !Number.isNaN(Number(String(v).replace(/[,]/g, "."))), {
      message: "Valor inválido",
    }),
  type: z.enum(["troca", "doacao"], {
    required_error: "Selecione se é troca ou doação",
  }),
  condition: z.enum(["novo", "seminovo", "usado"], {
    required_error: "Selecione a condição",
  }),
  location: z.string({ required_error: "Informe a localização" }),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length <= MAX_IMAGES, `Máximo de ${MAX_IMAGES} imagens`)
    .optional(),
});

type FormValues = z.infer<typeof schema>;

const categoriesWithSubcategories = {
  eletronicos: {
    label: "Eletrônicos",
    subcategories: [
      { value: "smartphones", label: "Smartphones" },
      { value: "notebooks", label: "Notebooks" },
      { value: "tablets", label: "Tablets" },
      { value: "fones", label: "Fones de Ouvido" },
      { value: "cameras", label: "Câmeras" },
      { value: "videogames", label: "Videogames" },
      { value: "tv", label: "TVs" },
      { value: "outros_eletronicos", label: "Outros Eletrônicos" }
    ]
  },
  moveis: {
    label: "Móveis",
    subcategories: [
      { value: "sofas", label: "Sofás" },
      { value: "mesas", label: "Mesas" },
      { value: "cadeiras", label: "Cadeiras" },
      { value: "camas", label: "Camas" },
      { value: "armarios", label: "Armários" },
      { value: "estantes", label: "Estantes" },
      { value: "decoracao", label: "Decoração" },
      { value: "outros_moveis", label: "Outros Móveis" }
    ]
  },
  roupas: {
    label: "Roupas",
    subcategories: [
      { value: "camisetas", label: "Camisetas" },
      { value: "calcas", label: "Calças" },
      { value: "vestidos", label: "Vestidos" },
      { value: "sapatos", label: "Sapatos" },
      { value: "acessorios", label: "Acessórios" },
      { value: "bolsas", label: "Bolsas" },
      { value: "jaquetas", label: "Jaquetas" },
      { value: "outras_roupas", label: "Outras Roupas" }
    ]
  },
  livros: {
    label: "Livros",
    subcategories: [
      { value: "ficcao", label: "Ficção" },
      { value: "nao_ficcao", label: "Não-ficção" },
      { value: "academicos", label: "Acadêmicos" },
      { value: "infantis", label: "Infantis" },
      { value: "tecnicos", label: "Técnicos" },
      { value: "biografias", label: "Biografias" },
      { value: "revistas", label: "Revistas" },
      { value: "outros_livros", label: "Outros Livros" }
    ]
  },
  esportes: {
    label: "Esportes",
    subcategories: [
      { value: "futebol", label: "Futebol" },
      { value: "academia", label: "Academia" },
      { value: "corrida", label: "Corrida" },
      { value: "natacao", label: "Natação" },
      { value: "ciclismo", label: "Ciclismo" },
      { value: "tenis", label: "Tênis" },
      { value: "outros_esportes", label: "Outros Esportes" }
    ]
  },
  casa: {
    label: "Casa e Jardim",
    subcategories: [
      { value: "eletrodomesticos", label: "Eletrodomésticos" },
      { value: "utensilios", label: "Utensílios" },
      { value: "plantas", label: "Plantas" },
      { value: "ferramentas", label: "Ferramentas" },
      { value: "limpeza", label: "Limpeza" },
      { value: "outros_casa", label: "Outros Casa" }
    ]
  },
  veiculos: {
    label: "Veículos",
    subcategories: [
      { value: "carros", label: "Carros" },
      { value: "motos", label: "Motos" },
      { value: "bicicletas", label: "Bicicletas" },
      { value: "pecas", label: "Peças" },
      { value: "acessorios_veiculos", label: "Acessórios" },
      { value: "outros_veiculos", label: "Outros Veículos" }
    ]
  },
  outros: {
    label: "Outros",
    subcategories: [
      { value: "arte", label: "Arte" },
      { value: "musica", label: "Música" },
      { value: "brinquedos", label: "Brinquedos" },
      { value: "pets", label: "Pets" },
      { value: "servicos", label: "Serviços" },
      { value: "diversos", label: "Diversos" }
    ]
  }
};

const categories = Object.entries(categoriesWithSubcategories).map(([value, data]) => ({
  value,
  label: data.label
}));

export default function AddItem() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectingPhotos, setSelectingPhotos] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      price: "",
      type: "troca",
      condition: "usado",
      location: "",
    },
  });

  const selectedCategory = form.watch("category");
  const availableSubcategories = selectedCategory ? categoriesWithSubcategories[selectedCategory as keyof typeof categoriesWithSubcategories]?.subcategories || [] : [];

  const imagesWatch = form.watch("images");
  const descriptionWatch = form.watch("description") || "";
  const titleWatch = form.watch("title") || "";

  useEffect(() => {
    const files = imagesWatch;
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = Array.from(files)
      .slice(0, MAX_IMAGES)
      .map((file) => URL.createObjectURL(file));

    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return urls;
    });

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imagesWatch]);

  const imagesCount = useMemo(() => previews.length, [previews]);
  const imagesProgress = useMemo(() => (imagesCount / MAX_IMAGES) * 100, [imagesCount]);
  const isNative = Capacitor.isNativePlatform();

  // Handler para selecionar fotos da galeria no mobile
  const handlePickPhotos = async () => {
    if (!isNative) {
      // No browser, dispara o clique no input file
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      input?.click();
      return;
    }

    try {
      setSelectingPhotos(true);
      const remainingSlots = MAX_IMAGES - imagesCount;
      if (remainingSlots <= 0) {
        toast({
          title: "Limite atingido",
          description: `Você já selecionou o máximo de ${MAX_IMAGES} imagens.`,
        });
        return;
      }

      const files = await pickPhotos(remainingSlots, 'gallery');
      
      if (files.length > 0) {
        // Criar um FileList simulado para o react-hook-form
        const dt = new DataTransfer();
        const currentFiles = form.getValues('images');
        if (currentFiles) {
          Array.from(currentFiles).slice(0, MAX_IMAGES - files.length).forEach((f) => dt.items.add(f));
        }
        files.forEach((f) => dt.items.add(f));
        form.setValue('images', dt.files);
        
        toast({
          title: "Fotos selecionadas",
          description: `${files.length} foto(s) adicionada(s) da galeria.`,
        });
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message !== 'Seleção cancelada') {
        toast({
          title: "Erro ao selecionar fotos",
          description: err.message || "Não foi possível acessar a galeria.",
        });
      }
    } finally {
      setSelectingPhotos(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setSaving(true);
      const payload = {
        titulo: values.title,
        descricao: values.description,
        categoria: values.category,
        subcategoria: values.subcategory,
        tipo: values.type,
        preco: values.price ? Number(String(values.price).replace(/[,]/g, ".")) : undefined,
        condicao: values.condition,
        localizacao: values.location,
      };
      const imagens = values.images ? Array.from(values.images).slice(0, MAX_IMAGES) : [];
      const created = await createItem(payload, imagens);

      toast({
        title: "Item criado com sucesso!",
        description: `"${created.titulo}" foi cadastrado e já está disponível.`,
      });
      
      // Limpar formulário
      form.reset({ title: "", description: "", category: "", subcategory: "", price: "", type: "troca", condition: "usado", location: "" });
      setPreviews([]);
      
      // Redirecionar para a home após 1 segundo
      setTimeout(() => {
        navigate("/app");
      }, 1000);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || "Erro ao criar item. Verifique os dados e tente novamente.";
      toast({ 
        title: "Erro ao criar item", 
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50 pb-24">
      <Header title={t('add')} showLanguageSelector showNotifications />
      <div className="max-w-2xl mx-auto px-4 pt-20 space-y-4">
        <div className="relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm animate-in fade-in-50 slide-in-from-top-2">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(1200px 200px at 10% -10%, hsl(var(--primary)/0.10), transparent 40%)" }} />
          <div className="relative flex items-start gap-3">
            <Badge className="bg-gradient-primary text-primary-foreground">Novo</Badge>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Preencha os dados do item que deseja anunciar para troca ou doação. Capriche nas fotos e descrição!</p>
            </div>
          </div>
        </div>
        <Card className="border-border/60 animate-in fade-in-50 zoom-in-95">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Adicionar Item</span>
              {titleWatch && (
                <span className="text-xs text-muted-foreground">Prévia do título: {titleWatch}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: Notebook usado, sofá, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea placeholder="Descreva o estado, acessórios, medidas, etc." rows={4} {...field} className="pr-16" />
                          <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
                            {descriptionWatch.length}/500
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("subcategory", ""); // Reset subcategory when category changes
                          }} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategoria</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!selectedCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={selectedCategory ? "Selecione uma subcategoria" : "Primeiro selecione uma categoria"} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSubcategories.map((sub) => (
                                <SelectItem key={sub.value} value={sub.value}>
                                  {sub.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor estimado (opcional)</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" placeholder="Ex.: 250" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2 rounded-lg border p-3">
                            <RadioGroupItem value="troca" id="troca" />
                            <label htmlFor="troca" className="text-sm font-medium leading-none">
                              Troca
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-lg border p-3">
                            <RadioGroupItem value="doacao" id="doacao" />
                            <label htmlFor="doacao" className="text-sm font-medium leading-none">
                              Doação
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condição</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a condição" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="novo">Novo</SelectItem>
                              <SelectItem value="seminovo">Seminovo</SelectItem>
                              <SelectItem value="usado">Usado</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex.: São Paulo, SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagens (até {MAX_IMAGES})</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div
                            className={
                              `relative mt-1 flex flex-col items-center justify-center gap-2 rounded-lg border bg-background/50 p-6 text-center transition-colors ${
                                isDragging ? 'border-primary/70 bg-accent' : 'border-dashed hover:border-primary/50'
                              } ${selectingPhotos ? 'opacity-50 pointer-events-none' : ''}`
                            }
                            onDragOver={(e) => { 
                              if (!isNative) {
                                e.preventDefault(); 
                                setIsDragging(true);
                              }
                            }}
                            onDragLeave={() => {
                              if (!isNative) {
                                setIsDragging(false);
                              }
                            }}
                            onDrop={(e) => {
                              if (!isNative) {
                                e.preventDefault();
                                setIsDragging(false);
                                const dt = new DataTransfer();
                                Array.from(e.dataTransfer.files)
                                  .slice(0, MAX_IMAGES)
                                  .forEach((f) => dt.items.add(f));
                                field.onChange(dt.files);
                              }
                            }}
                            onClick={!isNative ? undefined : handlePickPhotos}
                          >
                            {!isNative && (
                              <input
                                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => field.onChange(e.target.files)}
                              />
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="pointer-events-none select-none">
                                  {isNative ? (
                                    <>
                                      <p className="text-sm text-muted-foreground">Toque para selecionar fotos da galeria</p>
                                      <p className="text-xs text-muted-foreground">Máx. {MAX_IMAGES} imagens • Formatos: JPG, PNG, WEBP</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm text-muted-foreground">Arraste as imagens aqui ou clique para selecionar</p>
                                      <p className="text-xs text-muted-foreground">Máx. {MAX_IMAGES} imagens • Formatos: JPG, PNG, WEBP</p>
                                    </>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isNative ? 'Selecione fotos da sua galeria' : 'Você pode soltar múltiplas imagens de uma vez'}
                              </TooltipContent>
                            </Tooltip>
                            {selectingPhotos && (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                                <p className="text-sm text-muted-foreground">Abrindo galeria...</p>
                              </div>
                            )}
                            <div className="w-full mt-3 space-y-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{imagesCount} / {MAX_IMAGES} selecionadas</span>
                                <span>{Math.round(imagesProgress)}%</span>
                              </div>
                              <Progress value={imagesProgress} className="h-2" />
                            </div>
                          </div>
                          {isNative && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePickPhotos}
                              disabled={selectingPhotos || imagesCount >= MAX_IMAGES}
                              className="w-full"
                            >
                              {selectingPhotos ? 'Abrindo galeria...' : imagesCount >= MAX_IMAGES ? 'Limite atingido' : `Selecionar fotos da galeria (${MAX_IMAGES - imagesCount} restantes)`}
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                      {imagesCount > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                          {previews.map((src, idx) => (
                            <div key={idx} className="relative aspect-square overflow-hidden rounded-md border group animate-in fade-in-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                            </div>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-primary text-white transition-transform hover:scale-[1.02] active:scale-[0.99]" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
                  <Button type="button" variant="secondary" onClick={() => { form.reset(); setPreviews([]); }}>
                    Limpar
                  </Button>
                </div>

                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Dicas para um anúncio de sucesso</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="fotos">
                      <AccordionTrigger>Fotos de qualidade</AccordionTrigger>
                      <AccordionContent>
                        Fotografe com boa iluminação e diferentes ângulos. Mostre detalhes e possíveis avarias.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="descricao">
                      <AccordionTrigger>Descrição completa</AccordionTrigger>
                      <AccordionContent>
                        Especifique estado de uso, tempo de uso, acessórios inclusos, medidas e motivos para troca/doação.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="categoria">
                      <AccordionTrigger>Categoria e valor</AccordionTrigger>
                      <AccordionContent>
                        Escolha a categoria correta e, se desejar, informe um valor de referência para facilitar negociações.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
