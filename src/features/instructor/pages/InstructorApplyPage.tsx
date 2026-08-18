import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInstructorStatus } from '@/api/instructor/queries'
import { useApplyInstructor } from '@/api/instructor/mutations'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APPLICATION_STATUS_LABELS } from '@/domain/types/instructor.types'

export default function InstructorApplyPage() {
  const navigate = useNavigate()
  const { data: status, isLoading } = useInstructorStatus()
  const applyMutation = useApplyInstructor()

  const [motivation, setMotivation] = useState('')
  const [experience, setExperience] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  if (isLoading) return <LoadingScreen />

  const app = status?.application ?? null

  const handleSubmit = () => {
    if (motivation.trim().length < 20 || experience.trim().length < 20) return
    applyMutation.mutate({
      motivation: motivation.trim(),
      experience: experience.trim(),
      portfolioUrl: portfolioUrl.trim() || undefined,
    })
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Tornar-se instrutor"
        description="Envie sua solicitação. Um moderador analisará antes de liberar a criação de cursos."
      >
        <Button variant="ghost" size="sm" onClick={() => navigate('/instructor')}>
          ← Voltar
        </Button>
      </PageHeader>

      {app?.status === 'PENDING' ? (
        <div className="hx-card p-4">
          <Badge variant="secondary">{APPLICATION_STATUS_LABELS.PENDING}</Badge>
          <p className="mt-3 text-sm text-slate-400">
            Sua solicitação está em análise. Você receberá acesso à área de instrutor após aprovação.
          </p>
        </div>
      ) : (
        <div className="hx-card space-y-4 p-5">
          {app?.status === 'REJECTED' && (
            <p className="rounded-md bg-red-900/20 p-3 text-sm text-red-300">
              Sua solicitação anterior foi rejeitada.
              {app.reviewedNotes ? ` Motivo: ${app.reviewedNotes}` : ''} Você pode enviar uma nova abaixo.
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="motivation">Motivação *</Label>
            <textarea
              id="motivation"
              className="hx-input min-h-24"
              placeholder="Por que você quer ser instrutor? (mín. 20 caracteres)"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="experience">Experiência *</Label>
            <textarea
              id="experience"
              className="hx-input min-h-24"
              placeholder="Descreva sua experiência e área de domínio (mín. 20 caracteres)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="portfolio">Portfólio (opcional)</Label>
            <Input
              id="portfolio"
              placeholder="https://..."
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>

          <Button
            disabled={
              applyMutation.isPending ||
              motivation.trim().length < 20 ||
              experience.trim().length < 20
            }
            onClick={handleSubmit}
          >
            {applyMutation.isPending ? 'Enviando...' : 'Enviar solicitação'}
          </Button>
        </div>
      )}
    </div>
  )
}