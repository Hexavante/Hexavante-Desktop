import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useVerifyCertificate } from '@/api/certificates/queries'
import { Search, CheckCircle, XCircle } from 'lucide-react'

export default function VerificarCertificadoPage() {
  const [code, setCode] = useState('')
  const { mutate: verifyCertificate, isPending, isError, isSuccess, data, reset } = useVerifyCertificate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      verifyCertificate(code.trim().toUpperCase())
    }
  }

  function handleCodeChange(value: string) {
    setCode(value.toUpperCase())
    if (isError || isSuccess) reset()
  }

  return (
    <div className="hx-page max-w-2xl mx-auto">
      <PageHeader title="Verificar Certificado" description="Valide a autenticidade de um certificado Hexavante" />

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="certificate-code" className="block text-sm font-medium text-slate-300 mb-2">
              Código do Certificado
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="certificate-code"
                type="text"
                placeholder="HXV-XXXXXXXX"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="pl-10"
                disabled={isPending}
                autoFocus
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Formato: HXV-XXXXXXXX (8 caracteres alfanuméricos)</p>
          </div>
          <Button type="submit" disabled={isPending || !code.trim()} className="w-full">
            {isPending ? 'Verificando...' : 'Verificar'}
          </Button>
        </form>
      </Card>

      {isSuccess && data?.certificate && (
        <Card className="border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-bold text-green-300">Certificado Válido</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Código:</span>
              <span className="font-mono text-white">{data.certificate.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estudante:</span>
              <span className="text-white">{data.certificate.user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Curso:</span>
              <span className="text-white">{data.certificate.course.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emitido em:</span>
              <span className="text-white">{new Date(data.certificate.issuedAt).toLocaleDateString('pt-BR')}</span>
            </div>
            {data.certificate.verifiedAt && (
              <div className="flex justify-between">
                <span className="text-slate-400">Verificado em:</span>
                <span className="text-white">{new Date(data.certificate.verifiedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => { setCode(''); reset() }}>
            Verificar outro
          </Button>
        </Card>
      )}

      {(isError || (isSuccess && !data?.certificate)) && !isPending && (
        <Card className="border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-400" />
            <h3 className="text-lg font-bold text-red-300">Certificado inválido</h3>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Nenhum certificado encontrado com o código <span className="font-mono">{code}</span>
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => { setCode(''); reset() }}>
            Tentar novamente
          </Button>
        </Card>
      )}
    </div>
  )
}