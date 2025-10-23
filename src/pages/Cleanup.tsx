import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { runManualCleanup, CleanupResult } from '@/services/system';

const Cleanup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CleanupResult | null>(null);

  const handleRunCleanup = async () => {
    try {
      setLoading(true);
      const res = await runManualCleanup();
      setResult(res);
      toast.success('Limpeza executada com sucesso');
    } catch (e: any) {
      if (e?.statusCode === 401) {
        toast.error('Não autorizado');
      } else {
        toast.error(e?.message || 'Falha ao executar limpeza');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-4">
        <h1 className="text-2xl font-bold mb-2">Admin: Limpeza Manual</h1>
        <Separator className="my-2" />
        <Card>
          <CardContent className="p-4 space-y-3">
            <Button onClick={handleRunCleanup} disabled={loading}>
              {loading ? 'Executando...' : 'Executar limpeza'}
            </Button>
            {result && (
              <div className="space-y-1">
                <p>Itens deletados: <strong>{result.deletedItems}</strong></p>
                <p>Imagens deletadas: <strong>{result.deletedImages}</strong></p>
                <p>Mensagem: <strong>{result.message}</strong></p>
                {result.errors?.length ? (
                  <div>
                    <p className="font-semibold">Erros:</p>
                    <ul className="list-disc pl-5">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Cleanup;