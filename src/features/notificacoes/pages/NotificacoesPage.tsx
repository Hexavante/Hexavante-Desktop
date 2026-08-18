import { useState } from 'react'
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

const NOTIFICATION_COLORS: Record<string, string> = {
  XP_EARNED: 'amber',
  COIN_EARNED: 'amber',
  LEVEL_UP: 'amber',
  COURSE_APPROVED: 'green',
  COURSE_REJECTED: 'red',
  COURSE_UPDATED: 'blue',
  INSTRUCTOR_APPROVED: 'green',
  INSTRUCTOR_REJECTED: 'red',
  CERTIFICATE_ISSUED: 'amber',
  SYSTEM_ANNOUNCEMENT: 'blue',
  MODERATION_ACTION: 'red',
  NEW_MESSAGE: 'blue',
  COMMUNITY_REPLY: 'green',
  SOLUTION_ACCEPTED: 'green',
}

export default function NotificacoesPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { data, isLoading, refetch } = useNotifications({ unreadOnly: filter === 'unread' })
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
            const color = NOTIFICATION_COLORS[notification.type] || 'slate'
            const isUnread = !notification.readAt

            return (
              <Card
                key={notification.id}
                className={`flex items-start gap-4 p-4 transition-all ${isUnread ? 'bg-white/[0.03] ring-1 ring-teal-500/20' : 'bg-white/[0.02]'} hover:bg-white/[0.04]`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-${color}-500/20 text-${color}-400`}>
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
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {notification.type.replace(/_/g, ' ').toLowerCase()}
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
                      onClick={() => window.open(notification.link!, '_blank')}
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