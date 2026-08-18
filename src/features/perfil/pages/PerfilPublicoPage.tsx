import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { usePublicProfile } from '@/api/users/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { MessageSquare, Award, Check, Calendar, User, Crown, Shield } from 'lucide-react'

export default function PerfilPublicoPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profile, isLoading, error } = usePublicProfile(username || '')

  if (isLoading) return <LoadingScreen />

  if (error || !profile) {
    return (
      <div className="hx-page max-w-2xl mx-auto text-center">
        <PageHeader title="Perfil não encontrado" />
        <Card>
          <EmptyState
            title="Usuário não encontrado"
            description="Este perfil não existe ou foi removido"
            action={{
              label: 'Voltar para Comunidade',
              onClick: () => navigate('/comunidade'),
            }}
          />
        </Card>
      </div>
    )
  }

  const isOwner = user?.username === profile.username

  const getJoinedDate = () => {
    return new Date(profile.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="hx-page max-w-3xl mx-auto">
      <PageHeader
        title={profile.fullName}
        description={`@${profile.username}`}
      >
        {isOwner && (
          <Link to="/perfil" className="hx-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
            <User className="h-4 w-4" />
            Editar Perfil
          </Link>
        )}
      </PageHeader>

      <Card className="mb-6">
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-4xl font-black text-cyan-400">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            {profile.isPremium && (
              <div className="absolute -bottom-2 -right-2">
                <Crown className="h-8 w-8 text-amber-400 drop-shadow-lg" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-slate-400">@{profile.username}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {profile.isPremium && (
                <Badge className="gap-1 bg-amber-500/20 text-amber-300 border-amber-500/30">
                  <Crown className="h-3 w-3" /> Premium
                </Badge>
              )}
              {profile.isVerified && (
                <Badge className="gap-1 bg-green-500/20 text-green-300 border-green-500/30">
                  <Shield className="h-3 w-3" /> Verificado
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Membro desde {getJoinedDate()}
            </p>
          </div>

          {profile.bio && (
            <div className="w-full">
              <p className="text-sm text-slate-300 text-center leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-sm font-bold text-white">Estatísticas</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-white/[0.03] rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-xs text-slate-400">Cursos</p>
            </div>
            <div className="text-center p-4 bg-white/[0.03] rounded-lg">
              <p className="text-2xl font-bold text-amber-400">0</p>
              <p className="text-xs text-slate-400">Certificados</p>
            </div>
            <div className="text-center p-4 bg-white/[0.03] rounded-lg">
              <p className="text-2xl font-bold text-teal-400">0</p>
              <p className="text-xs text-slate-400">Simulados</p>
            </div>
          </div>
        </div>
      </Card>

      {!isOwner && (
        <Card className="mt-6 border-teal-500/30 bg-teal-500/5">
          <div className="p-6 text-center">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-teal-400" />
            <h3 className="text-lg font-bold text-white mb-2">Iniciar conversa</h3>
            <p className="text-sm text-slate-400 mb-4">Envie uma mensagem para {profile.fullName}</p>
            <Button onClick={() => navigate(`/mensagens`)} variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" /> Nova Mensagem
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}