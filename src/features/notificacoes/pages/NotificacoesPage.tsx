import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from '@/api/notifications/queries'
import { Bell, Check, Mail, Award, Users, BookOpen, Clock, CheckCircle2 } from 'lucide-react'

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  XP_EARNED: Award,
  COIN_EARNED: Award,
  LEVEL_UP: Award,
  COURSE_APPROVED: CheckCircle2,
  COURSE_REJECTED: Mail,
  COURSE_UPDATED: BookOpen,
  INSTRUCTOR_APPROVED: Award,
  INSTRUCTOR_REJECTED: Mail,
  CERTIFICATE_ISSUED: Award,
  SYSTEM_ANNOUNCEMENT: Bell,
  MODERATION_ACTION: Users,
  NEW_MESSAGE: Mail,
  COMMUNITY_REPLY: Users,
  SOLUTION_ACCEPTED: CheckCircle2,
}

const NOTIFICATION_STYLES: Record<string, string> = {
  XP_EARNED: 'bg-amber-500/20 text-amber-400',
  COIN_EARNED: 'bg-amber-500/20 text-amber-400',
  LEVEL_UP: 'bg-amber-500/20 text-amber-400',
  COURSE_APPROVED: 'bg-green-500/20 text-green-400',
  COURSE_REJECTED: 'bg-red-500/20 text-red-400',
  COURSE_UPDATED: 'bg-blue-500/20 text-blue-400',
  INSTRUCTOR_APPROVED: 'bg-green-500/20 text-green-400',
  INSTRUCTOR_REJECTED: 'bg-red-500/20 text-red-400',
  CERTIFICATE_ISSUED: 'bg-amber-500/20 text-amber-400',
  SYSTEM_ANNOUNCEMENT: 'bg-blue-500/20 text-blue-400',
  MODERATION_ACTION: 'bg-red-500/20 text-red-400',
  NEW_MESSAGE: 'bg-blue-500/20 text-blue-400',
  COMMUNITY_REPLY: 'bg-green-500/20 text-green-400',
  SOLUTION_ACCEPTED: 'bg-green-500/20 text-green-400',
}

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  XP_EARNED: 'XP recebido',
  COIN_EARNED: 'Moedas recebidas',
  LEVEL_UP: 'Subiu de nível',
  COURSE_APPROVED: 'Curso aprovado',
  COURSE_REJECTED: 'Curso recusado',
  COURSE_UPDATED: 'Curso atualizado',
  INSTRUCTOR_APPROVED: 'Instrutor aprovado',
  INSTRUCTOR_REJECTED: 'Instrutor recusado',
  CERTIFICATE_ISSUED: 'Certificado emitido',
  SYSTEM_ANNOUNCEMENT: 'Aviso do sistema',
  MODERATION_ACTION: 'Ação de moderação',
  NEW_MESSAGE: 'Nova mensagem',
  COMMUNITY_REPLY: 'Resposta na comunidade',
  SOLUTION_ACCEPTED: 'Solução aceita',
}

export default function NotificacoesPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { data, isLoading, isError, refetch } = useNotifications({ unreadOnly: filter === 'unread' })
  const markAllRead = useMarkAllNotificationsRead()
  const markRead = useMarkNotificationRead()

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  const handleMarkRead = (id: string) => {
    markRead.mutate(id)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora mesmo'
    if (diffMins < 60) return `${diffMins}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('pt-BR')
  }

  if (isLoading) return <LoadingScreen />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Notificações" description="Suas atualizações na plataforma" />
        <EmptyState
          title="Erro ao carregar notificações"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  function handleOpenLink(link: string) {
    if (link.startsWith('/')) {
      navigate(link)
    } else {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Notificações"
        description={unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Todas lidas'}
      >
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </PageHeader>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            filter === 'all'
              ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            filter === 'unread'
              ? 'bg-teal-500/20 text-teal-200 ring-1 ring-teal-400/40'
              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
          }`}
        >
          <Bell className="h-4 w-4 mr-1" /> Não lidas ({unreadCount})
        </button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title={filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
          description={filter === 'unread' ? 'Todas as notificações foram lidas' : 'Você será notificado sobre atividades na plataforma'}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell
            const style = NOTIFICATION_STYLES[notification.type] || 'bg-slate-500/20 text-slate-400'
            const typeLabel = NOTIFICATION_TYPE_LABELS[notification.type] || notification.type.replace(/_/g, ' ').toLowerCase()
            const isUnread = !notification.readAt

            return (
              <Card
                key={notification.id}
                className={`flex items-start gap-4 p-4 transition-all ${isUnread ? 'bg-white/[0.03] ring-1 ring-teal-500/20' : 'bg-white/[0.02]'} hover:bg-white/[0.04]`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${style}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-semibold text-white ${isUnread ? '' : 'text-slate-300'}`}>
                        {notification.title}
                      </h4>
                      <p className={`mt-1 text-sm ${isUnread ? 'text-slate-300' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {typeLabel}
                        </Badge>
                      </div>
                    </div>
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-teal-400 hover:bg-teal-500/10"
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={markRead.isPending}
                        aria-label="Marcar como lida"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {notification.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-teal-400 hover:text-teal-300"
                      onClick={() => handleOpenLink(notification.link!)}
                    >
                      Ver detalhes
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}