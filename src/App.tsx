import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { SafeArea } from "capacitor-plugin-safe-area";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyItems from "./pages/MyItems";
import LikedItems from "./pages/LikedItems";
import AddItem from "./pages/AddItem";
import Premium from "./pages/Premium";
import Payment from "./pages/Payment";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Matches from "./pages/Matches";
import Welcome from "./pages/Welcome";
import Cleanup from "./pages/Cleanup";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const configureNativeApp = async () => {
      try {
        // Configurar StatusBar em modo overlay para respeitar safe areas
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setBackgroundColor({ color: '#0F172A' });
        await StatusBar.setStyle({ style: Style.Dark });

        // Configurar Keyboard para redimensionar o conteúdo corretamente
        await Keyboard.setResizeMode({ mode: KeyboardResize.Native });

        // Aplicar safe area insets dinamicamente
        const safeAreaInsets = await SafeArea.getSafeAreaInsets();
        const root = document.documentElement;
        root.style.setProperty('--safe-area-inset-top', `${safeAreaInsets.insets.top}px`);
        root.style.setProperty('--safe-area-inset-bottom', `${safeAreaInsets.insets.bottom}px`);
        root.style.setProperty('--safe-area-inset-left', `${safeAreaInsets.insets.left}px`);
        root.style.setProperty('--safe-area-inset-right', `${safeAreaInsets.insets.right}px`);

        // Listener para mudanças nas safe areas (rotação, etc)
        if (SafeArea.addListener) {
          await SafeArea.addListener('safeAreaChanged', (data: { insets: { top: number; bottom: number; left: number; right: number } }) => {
            root.style.setProperty('--safe-area-inset-top', `${data.insets.top}px`);
            root.style.setProperty('--safe-area-inset-bottom', `${data.insets.bottom}px`);
            root.style.setProperty('--safe-area-inset-left', `${data.insets.left}px`);
            root.style.setProperty('--safe-area-inset-right', `${data.insets.right}px`);
          });
        }
      } catch (error) {
        console.warn('[Capacitor] Falha ao configurar a aplicação nativa', error);
      }
    };

    configureNativeApp();

    // Cleanup: remover todos os listeners quando o componente desmontar
    return () => {
      if (SafeArea.removeAllListeners) {
        SafeArea.removeAllListeners();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/esqueci-senha" element={<ForgotPassword />} />
                <Route path="/redefinir-senha" element={<ResetPassword />} />
                <Route path="/app" element={<Index />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:conversationId" element={<Chat />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/admin/cleanup" element={<Cleanup />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/perfil/editar" element={<EditProfile />} />
                <Route path="/perfil/configuracoes" element={<Settings />} />
                <Route path="/meus-itens" element={<MyItems />} />
                <Route path="/itens-curtidos" element={<LikedItems />} />
                <Route path="/adicionar-item" element={<AddItem />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/pagamento" element={<Payment />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
