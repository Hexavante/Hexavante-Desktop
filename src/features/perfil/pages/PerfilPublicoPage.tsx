import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { usePublicProfile } from '@/api/users/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { Award, Check, Calendar, User, Crown, Shield } from 'lucide-react'

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
        <Card className="p-5">
          <EmptyState
            title="Usuário não encontrado"
            description="Este perfil não existe ou foi removido"
            action={{
              label: 'Voltar para o início',
              onClick: () => navigate('/'),
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
            <p className="text-2xl font-bold text-foreground">{profile.fullName}</p>
            <p className="text-muted-foreground">@{profile.username}</p>

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

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Membro desde {getJoinedDate()}
            </p>
          </div>

          {profile.bio && (
            <div className="w-full">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-sm font-bold text-foreground">Estatísticas</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-surface rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-xs text-muted-foreground">Cursos</p>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <p className="text-2xl font-bold text-amber-400">0</p>
              <p className="text-xs text-muted-foreground">Certificados</p>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <p className="text-2xl font-bold text-teal-400">0</p>
              <p className="text-xs text-muted-foreground">Simulados</p>
            </div>
          </div>
        </div>
      </Card>

    </div>
  )
}