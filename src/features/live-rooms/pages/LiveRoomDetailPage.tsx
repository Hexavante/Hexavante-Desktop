import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveRoomDetail, useLiveRoomMessages } from '@/api/live-rooms/queries'
import {
  useJoinLiveRoom,
  useLeaveLiveRoom,
  useStartLiveRoom,
  useEndLiveRoom,
  useCancelLiveRoom,
  useSendLiveMessage,
} from '@/api/live-rooms/mutations'
import { useAuth } from '@/app/hooks/use-auth'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LIVE_ROOM_STATUS_LABELS,
  formatScheduledDate,
} from '@/domain/types/live-room.types'

export default function LiveRoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { data: room, isLoading, isError } = useLiveRoomDetail(id!)
  const { data: messages, refetch: refetchMessages } = useLiveRoomMessages(id!)
  const joinMutation = useJoinLiveRoom(id!)
  const leaveMutation = useLeaveLiveRoom(id!)
  const startMutation = useStartLiveRoom(id!)
  const endMutation = useEndLiveRoom(id!)
  const cancelMutation = useCancelLiveRoom(id!)
  const sendMutation = useSendLiveMessage(id!)

  useEffect(() => {
    if (room?.status !== 'LIVE') return
    const interval = setInterval(() => {
      refetchMessages()
    }, 5000)
    return () => clearInterval(interval)
  }, [room?.status, refetchMessages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) return <LoadingScreen />
  if (isError || !room) {
    return (
      <EmptyState
        title="Sala não encontrada"
        description="A sala ao vivo não existe ou foi encerrada"
        action={{ label: 'Ver salas', onClick: () => navigate('/live') }}
      />
    )
  }

  const handleJoin = () => {
    if (!isAuthenticated) return
    joinMutation.mutate()
  }

  const handleSend = () => {
    if (!message.trim()) return
    sendMutation.mutate(message.trim(), { onSuccess: () => setMessage('') })
  }

  return (
    <div className="hx-page">
      <PageHeader
        title={room.title}
        description={room.course?.title ?? undefined}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate('/live')}>
          ← Voltar
        </Button>
        <Badge variant={room.status === 'LIVE' ? 'emerald' : 'secondary'}>
          {LIVE_ROOM_STATUS_LABELS[room.status]}
        </Badge>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {room.videoUrl ? (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              <span className="text-sm text-slate-400">Player de vídeo</span>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-white/5">
              <span className="text-5xl">📡</span>
            </div>
          )}

          {room.description && (
            <div className="hx-card p-4 text-sm text-slate-400">{room.description}</div>
          )}

          <div className="hx-card p-4">
            <p className="text-sm text-slate-400">
              Agendada para {formatScheduledDate(room.scheduledAt)}
            </p>
            <p className="text-sm text-slate-500">
              {room.activeParticipants.length} participantes ativos
            </p>
          </div>

          {room.isInstructor && (
            <div className="hx-card flex flex-wrap gap-2 p-4">
              {room.status === 'SCHEDULED' && (
                <Button onClick={() => startMutation.mutate()}>Iniciar transmissão</Button>
              )}
              {room.status === 'LIVE' && (
                <Button variant="danger" onClick={() => endMutation.mutate()}>
                  Encerrar
                </Button>
              )}
              {room.status === 'SCHEDULED' && (
                <Button variant="outline" onClick={() => cancelMutation.mutate()}>
                  Cancelar
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="hx-card flex max-h-[70vh] flex-col p-0">
          <div className="border-b border-white/10 p-3 text-sm font-bold text-white">
            Chat
          </div>

          {(room.status === 'LIVE' || room.status === 'SCHEDULED') && !room.isParticipant && !room.isInstructor && (
            <div className="p-3">
              <Button className="w-full" onClick={handleJoin}>
                Entrar na sala
              </Button>
            </div>
          )}

          {(room.isInstructor || room.isParticipant) && (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {!messages || messages.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhuma mensagem ainda.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="text-sm">
                      <span className="font-semibold text-cyan-300">{m.user.fullName}: </span>
                      <span className="text-slate-300">{m.message}</span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {room.status === 'LIVE' && (
                <div className="border-t border-white/10 p-3">
                  <div className="flex gap-2">
                    <input
                      className="hx-input flex-1"
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                      size="sm"
                      disabled={!message.trim() || sendMutation.isPending}
                      onClick={handleSend}
                    >
                      Enviar
                    </Button>
                  </div>
                  {room.isParticipant && !room.isInstructor && (
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => leaveMutation.mutate()}>
                      Sair da sala
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}