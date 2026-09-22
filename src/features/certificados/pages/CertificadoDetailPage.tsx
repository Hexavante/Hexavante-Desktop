import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { certificatesApi } from '@/api/certificates/api'
import { Download, CheckCircle, ExternalLink, Share2 } from 'lucide-react'

interface CertificateDetail {
  id: string
  code: string
  issuedAt: string
  verifiedAt: string | null
  user: {
    fullName: string
  }
  course: {
    title: string
  }
}

export default function CertificadoDetailPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    const fetchCertificate = async () => {
      try {
        const response = await certificatesApi.verifyCertificate(code)
        setCertificate(response.certificate)
      } catch (err) {
        setError('Certificado não encontrado')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificate()
  }, [code])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificado Hexavante - ${certificate?.course.title}`,
          text: `Certificado de conclusão emitido para ${certificate?.user.fullName}`,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) return <LoadingScreen />

  if (error || !certificate) {
    return (
      <div className="hx-page max-w-2xl mx-auto text-center">
        <PageHeader title="Certificado Não Encontrado" />
        <Card className="border-red-500/30 bg-red-500/5">
          <div className="p-8">
            <p className="text-red-300 mb-4">{error || 'Certificado não encontrado'}</p>
            <Button onClick={() => navigate('/certificados/verificar')}>Verificar Outro</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="hx-page max-w-3xl mx-auto">
      <PageHeader
        title="Certificado de Conclusão"
        description="Hexavante - Plataforma Educacional"
      />

      <div className="print:hidden mb-6 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Download className="h-4 w-4 mr-1" /> Imprimir / Salvar PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" /> Compartilhar
        </Button>
      </div>

      <Card className="border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 text-center border-b border-border pb-8">
            <div className="mb-4 text-6xl">📜</div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Certificado de Conclusão</h1>
            <p className="text-muted-foreground">Hexavante - Plataforma Educacional</p>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-center">
            <div>
              <p className="text-lg text-muted-foreground mb-2">Certificamos que</p>
              <p className="text-3xl md:text-4xl font-bold text-foreground">{certificate.user.fullName}</p>
            </div>

            <div className="my-6">
              <p className="text-lg text-muted-foreground mb-2">concluiu com êxito o curso</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-300">{certificate.course.title}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="p-4 bg-surface rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Código</p>
                <p className="font-mono text-sm text-foreground break-all">{certificate.code}</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Emissão</p>
                <p className="text-sm text-foreground">{new Date(certificate.issuedAt).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                <p className="text-sm text-green-400 flex items-center justify-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Válido
                </p>
              </div>
              {certificate.verifiedAt && (
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Verificação</p>
                  <p className="text-sm text-foreground">{new Date(certificate.verifiedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>

            {/* Verification URL */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Verifique a autenticidade em:</p>
              <p className="text-xs text-muted-foreground font-mono break-all">{window.location.origin}/certificados/verificar/{certificate.code}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
            <span>Hexavante © 2024</span>
            <span>Documento digital verificado por blockchain</span>
          </div>
        </div>
      </Card>
    </div>
  )
}