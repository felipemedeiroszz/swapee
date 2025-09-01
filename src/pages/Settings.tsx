import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import Header from '@/components/Header'
import { ArrowLeft, Shield, Bell, Trash2 } from 'lucide-react'

const Settings = () => {
  const navigate = useNavigate()
  
  const [notifPush, setNotifPush] = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)
  const [notifMatch, setNotifMatch] = useState(true)
  const [privPerfilPublico, setPrivPerfilPublico] = useState(true)

  const salvarPreferencias = () => {
    toast.success('Preferências salvas com sucesso')
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <Header
        title="Configurações"
        leftIcon={
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-accent/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      />

      <main className="pt-20 pb-24 px-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Ajustes da sua conta</h1>
          <p className="text-sm text-muted-foreground">Gerencie informações da conta, notificações, privacidade e preferências do aplicativo.</p>
        </div>

        <Tabs defaultValue="seguranca" className="space-y-4">
          <TabsList className="flex md:grid md:grid-cols-3 gap-2 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <TabsTrigger value="seguranca" className="flex items-center gap-2 min-w-[160px] h-10 px-4 md:min-w-0"><Shield className="w-4 h-4" /> Segurança</TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2 min-w-[160px] h-10 px-4 md:min-w-0"><Bell className="w-4 h-4" /> Notificações</TabsTrigger>
            <TabsTrigger value="privacidade" className="flex items-center gap-2 min-w-[160px] h-10 px-4 md:min-w-0"><Shield className="w-4 h-4" /> Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="seguranca">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Alterar senha</Label>
                    <Input id="senha" type="password" placeholder="Nova senha" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha2">Confirmar senha</Label>
                    <Input id="senha2" type="password" placeholder="Confirmar nova senha" />
                  </div>
                  <Button onClick={() => toast.success('Senha atualizada')}>Atualizar senha</Button>

                  <Separator className="my-2" />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2"><Trash2 className="w-4 h-4" /> Excluir conta</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja excluir sua conta?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação é permanente e não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success('Conta excluída (exemplo)')}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Notificações por push</p>
                    <p className="text-sm text-muted-foreground">Receber alertas instantâneos no app</p>
                  </div>
                  <Switch checked={notifPush} onCheckedChange={setNotifPush} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Notificações por email</p>
                    <p className="text-sm text-muted-foreground">Atualizações periódicas por email</p>
                  </div>
                  <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Alertas de match</p>
                    <p className="text-sm text-muted-foreground">Seja avisado quando houver um match</p>
                  </div>
                  <Switch checked={notifMatch} onCheckedChange={setNotifMatch} />
                </div>
                <div className="pt-2">
                  <Button onClick={salvarPreferencias}>Salvar preferências</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacidade">
            <Card>
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Perfil público</p>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
                  </div>
                  <Switch checked={privPerfilPublico} onCheckedChange={setPrivPerfilPublico} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quem pode enviar mensagens</Label>
                    <Select defaultValue="todos">
                      <SelectTrigger>
                        <SelectValue placeholder="Escolher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="matches">Somente matches</SelectItem>
                        <SelectItem value="ninguem">Ninguém</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mostrar distância</Label>
                    <Select defaultValue="sim">
                      <SelectTrigger>
                        <SelectValue placeholder="Escolher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={salvarPreferencias}>Salvar preferências</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>
      </main>
    </div>
  )
}

export default Settings
