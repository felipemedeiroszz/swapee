import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getWelcomeMessage } from '@/services/system';

const Welcome = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const msg = await getWelcomeMessage();
        setMessage(msg);
      } catch (e: any) {
        toast.error(e?.message || 'Falha ao obter a mensagem de boas-vindas');
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-4">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo</h1>
        <Separator className="my-2" />
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <p className="text-lg">{message || 'Bem-vindo!'}</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Welcome;