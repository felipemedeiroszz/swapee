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
import { ArrowLeft, Shield, Bell, Trash2, Coins, Eraser, LifeBuoy } from 'lucide-react'
import HealthStatus from '@/components/HealthStatus'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { linkOAuth } from '@/services/auth'
import { changeUserPassword, deleteUser } from '@/services/users'

const Settings = () => {
  const navigate = useNavigate()
  
  const [notifPush, setNotifPush] = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)
  const [notifMatch, setNotifMatch] = useState(true)
  const [coins, setCoins] = useState<number>(() => parseInt(localStorage.getItem('swapee-coins') || '0', 10) || 0)
  const [donations, setDonations] = useState<number>(() => parseInt(localStorage.getItem('swapee-donations') || '0', 10) || 0)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [oauthDialogOpen, setOauthDialogOpen] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<'google' | 'apple' | null>(null)
  const [oauthEmail, setOauthEmail] = useState('')
  const [oauthPassword, setOauthPassword] = useState('')
  const [oauthLoading, setOauthLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)

  const salvarPreferencias = () => {
    toast.success('Preferências salvas com sucesso')
  }



  const limparCache = () => {
    // Mantém coins e donations
    const keepCoins = localStorage.getItem('swapee-coins')
    const keepDonations = localStorage.getItem('swapee-donations')
    localStorage.clear()
    if (keepCoins !== null) localStorage.setItem('swapee-coins', keepCoins)
    if (keepDonations !== null) localStorage.setItem('swapee-donations', keepDonations)
    toast.success('Cache limpo')
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

        <Tabs defaultValue="recompensas" className="space-y-4">
          <TabsList className="flex md:grid md:grid-cols-3 gap-2 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <TabsTrigger value="recompensas" className="flex items-center gap-2 min-w-[160px] h-10 px-4 md:min-w-0"><Coins className="w-4 h-4" /> Recompensas</TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2 min-w-[160px] h-10 px-4 md:min-w-0"><Shield className="w-4 h-4" /> Segurança</TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2 min-w-[160px] h-10 px-4 md:min-w-0"><Bell className="w-4 h-4" /> Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="recompensas">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Suas moedas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 border">
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo atual</p>
                      <p className="text-3xl font-bold text-amber-700">{coins} coins</p>
                      <p className="text-xs text-muted-foreground mt-1">Você ganha 100 coins por cada doação concluída.</p>
                    </div>
                    <Coins className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/perfil')}>Ver no perfil</Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Doações concluídas</span>
                    <span className="text-sm font-semibold">{donations}</span>
                  </div>
                </CardContent>
              </Card>


            </div>
          </TabsContent>

          <TabsContent value="seguranca">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha atual</Label>
                    <Input 
                      id="senhaAtual" 
                      type="password" 
                      placeholder="Digite sua senha atual" 
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova senha</Label>
                    <Input 
                      id="novaSenha" 
                      type="password" 
                      placeholder="Digite a nova senha" 
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      disabled={!senhaAtual}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                    <Input 
                      id="confirmarSenha" 
                      type="password" 
                      placeholder="Confirme a nova senha" 
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      disabled={!senhaAtual}
                    />
                  </div>
                  <Button 
                    onClick={async () => {
                      if (!senhaAtual) {
                        toast.error('Digite sua senha atual')
                        return
                      }
                      if (novaSenha !== confirmarSenha) {
                        toast.error('As senhas não coincidem')
                        return
                      }
                      if (novaSenha.length < 6) {
                        toast.error('A nova senha deve ter pelo menos 6 caracteres')
                        return
                      }
                      const userId = localStorage.getItem('swapee-user-id')
                      if (!userId) {
                        toast.error('ID do usuário não encontrado')
                        return
                      }
                      setPwdLoading(true)
                      try {
                        await changeUserPassword(userId, { currentPassword: senhaAtual, newPassword: novaSenha })
                        toast.success('Senha atualizada com sucesso')
                        setSenhaAtual('')
                        setNovaSenha('')
                        setConfirmarSenha('')
                      } catch (err: any) {
                        const msg = err?.message || 'Erro ao atualizar senha'
                        toast.error(msg)
                      } finally {
                        setPwdLoading(false)
                      }
                    }}
                    disabled={pwdLoading || !senhaAtual || !novaSenha || !confirmarSenha}
                  >
                    {pwdLoading ? 'Atualizando...' : 'Atualizar senha'}
                  </Button>

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
                        <AlertDialogAction onClick={async () => {
                          const userId = localStorage.getItem('swapee-user-id')
                          if (!userId) {
                            toast.error('ID do usuário não encontrado')
                            return
                          }
                          try {
                            await deleteUser(userId)
                            toast.success('Conta excluída com sucesso')
                            localStorage.clear()
                            navigate('/login')
                          } catch (err: any) {
                            const msg = err?.message || 'Erro ao excluir conta'
                            toast.error(msg)
                          }
                        }}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vincular conta OAuth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Conecte sua conta do Google ou Apple à sua conta existente.</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => { setOauthProvider('google'); setOauthDialogOpen(true); }}
                    >
                      Vincular Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setOauthProvider('apple'); setOauthDialogOpen(true); }}
                    >
                      Vincular Apple
                    </Button>
                  </div>

                  <Dialog open={oauthDialogOpen} onOpenChange={setOauthDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {oauthProvider === 'google' ? 'Vincular Google' : oauthProvider === 'apple' ? 'Vincular Apple' : 'Vincular conta OAuth'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="oauthEmail">Email da conta existente</Label>
                          <Input
                            id="oauthEmail"
                            type="email"
                            placeholder="voce@exemplo.com"
                            value={oauthEmail}
                            onChange={(e) => setOauthEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="oauthPassword">Senha da conta existente</Label>
                          <Input
                            id="oauthPassword"
                            type="password"
                            placeholder="••••••••"
                            value={oauthPassword}
                            onChange={(e) => setOauthPassword(e.target.value)}
                          />
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setOauthDialogOpen(false)
                              setOauthProvider(null)
                              setOauthEmail('')
                              setOauthPassword('')
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            disabled={oauthLoading || !oauthProvider || !oauthEmail || !oauthPassword}
                            onClick={async () => {
                              if (!oauthProvider) return
                              setOauthLoading(true)
                              try {
                                const res = await linkOAuth({ provider: oauthProvider, email: oauthEmail, password: oauthPassword })
                                if (res?.success) {
                                  toast.success(res.message || 'Conta vinculada com sucesso')
                                  setOauthDialogOpen(false)
                                  setOauthProvider(null)
                                  setOauthEmail('')
                                  setOauthPassword('')
                                } else {
                                  toast.error(res?.message || 'Não foi possível vincular a conta')
                                }
                              } catch (err: any) {
                                const msg = err?.message || 'Erro ao vincular conta'
                                toast.error(msg)
                              } finally {
                                setOauthLoading(false)
                              }
                            }}
                          >
                            {oauthLoading ? 'Vinculando...' : 'Vincular'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <HealthStatus />
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



          
        </Tabs>
      </main>
    </div>
  )
}

export default Settings
