import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, HardDrive, Database, Cpu, Server, Info } from 'lucide-react';
import { getHealthOverall, getHealthDatabase, getHealthRedis, getHealthMemory, getHealthDisk, getHealthInfo, type HealthResponse } from '@/services/health';

function StatusBadge({ status }: { status?: 'up'|'down' }) {
  const isUp = status === 'up';
  return (
    <Badge variant={isUp ? 'default' : 'destructive'}>
      {isUp ? 'UP' : 'DOWN'}
    </Badge>
  );
}

function Section({ title, icon, data }: { title: string; icon: React.ReactNode; data?: HealthResponse }) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      {!data ? (
        <div className="text-sm text-muted-foreground">Sem dados</div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={data.status === 'ok' ? 'default' : 'destructive'}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Detalhes:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(data.details || {}).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                  <span className="text-sm">{k}</span>
                  <StatusBadge status={v.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const HealthStatus = () => {
  const overall = useQuery({ queryKey: ['health','overall'], queryFn: getHealthOverall, refetchOnWindowFocus: false });
  const db = useQuery({ queryKey: ['health','database'], queryFn: getHealthDatabase, refetchOnWindowFocus: false });
  const redis = useQuery({ queryKey: ['health','redis'], queryFn: getHealthRedis, refetchOnWindowFocus: false });
  const memory = useQuery({ queryKey: ['health','memory'], queryFn: getHealthMemory, refetchOnWindowFocus: false });
  const disk = useQuery({ queryKey: ['health','disk'], queryFn: getHealthDisk, refetchOnWindowFocus: false });
  const info = useQuery({ queryKey: ['health','info'], queryFn: getHealthInfo, refetchOnWindowFocus: false });

  const refetchAll = () => {
    overall.refetch();
    db.refetch();
    redis.refetch();
    memory.refetch();
    disk.refetch();
    info.refetch();
  };

  const anyLoading = overall.isLoading || db.isLoading || redis.isLoading || memory.isLoading || disk.isLoading || info.isLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <LifeLineIcon />
          Status do Sistema
        </CardTitle>
        <Button variant="outline" size="sm" onClick={refetchAll} disabled={anyLoading}>
          <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {anyLoading && (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        )}

        {/* Overall */}
        <Section title="Geral" icon={<Server className="w-4 h-4" />} data={overall.data} />

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Banco de Dados" icon={<Database className="w-4 h-4" />} data={db.data} />
          <Section title="Redis" icon={<Cpu className="w-4 h-4" />} data={redis.data} />
          <Section title="Memória" icon={<Info className="w-4 h-4" />} data={memory.data} />
          <Section title="Disco" icon={<HardDrive className="w-4 h-4" />} data={disk.data} />
        </div>

        {/* Info */}
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" />
            <span className="font-medium">Informações da Aplicação</span>
          </div>
          <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-48">
            {info.data ? JSON.stringify(info.data, null, 2) : 'Sem informações'}
          </pre>
        </div>

        {(overall.error || db.error || redis.error || memory.error || disk.error || info.error) && (
          <div className="text-sm text-destructive">
            Erro ao consultar um ou mais serviços. Verifique a URL do backend.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function LifeLineIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12h4l2-5 4 10 2-5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default HealthStatus;