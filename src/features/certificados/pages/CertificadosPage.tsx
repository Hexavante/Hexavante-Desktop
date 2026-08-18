import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useUserCertificates } from '@/api/certificates/queries'
import { ExternalLink } from 'lucide-react'

export default function CertificadosPage() {
  const { data: certificates, isLoading } = useUserCertificates()

  if (isLoading) return <LoadingScreen />

  return (
    <div className="hx-page">
      <PageHeader title="Meus Certificados" description="Certificados de conclusão de cursos" />

      {!certificates || certificates.length === 0 ? (
        <EmptyState
          title="Nenhum certificado ainda"
          description="Conclua cursos para ganhar certificados"
          action={{
            label: 'Explorar Cursos',
            onClick: () => { window.location.href = '/cursos' }
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-b border-white/10">
                <span className="text-5xl">📜</span>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {cert.course.categoryName}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Verificado
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2">{cert.course.title}</h3>
                <p className="mt-2 text-xs text-slate-400">
                  Emitido em {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
                </p>
                <p className="mt-1 text-xs text-slate-500 font-mono">Código: {cert.code}</p>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigator.clipboard.writeText(cert.code)}
                  >
                    <span className="mr-2">📋</span> Copiar Código
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/certificados/c/${cert.code}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Ver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}