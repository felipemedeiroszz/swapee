import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyItems from "./pages/MyItems";
import LikedItems from "./pages/LikedItems";
import AddItem from "./pages/AddItem";
import Premium from "./pages/Premium";
import Payment from "./pages/Payment";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <NotificationsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/app" element={<Index />} />
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

export default App;
