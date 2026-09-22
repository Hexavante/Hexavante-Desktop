import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveRooms } from '@/api/live-rooms/queries'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  LIVE_ROOM_STATUS_LABELS,
  formatScheduledDate,
} from '@/domain/types/live-room.types'
import { Radio } from 'lucide-react'

type Filter = 'all' | 'scheduled' | 'live' | 'ended'

const FILTER_LABELS: Record<Filter, string> = {
  all: 'Todas',
  scheduled: 'Agendadas',
  live: 'Ao vivo',
  ended: 'Encerradas',
}

export default function LiveRoomsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const { data: rooms, isLoading, isError, refetch } = useLiveRooms(filter === 'all' ? undefined : filter)

  if (isLoading) return <LoadingScreen />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Salas ao vivo" description="Participe de transmissões ao vivo com instrutores." />
        <EmptyState
          title="Erro ao carregar salas"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader title="Salas ao vivo" description="Participe de transmissões ao vivo com instrutores." />

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'scheduled', 'live', 'ended'] as Filter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Todas' : FILTER_LABELS[f]}
          </Button>
        ))}
      </div>

      {!rooms || rooms.length === 0 ? (
        <EmptyState
          icon={<Radio className="h-12 w-12 text-muted-foreground" aria-hidden="true" />}
          title="Nenhuma sala encontrada"
          description={filter === 'all' ? 'Não há salas ao vivo neste momento.' : 'Nenhuma sala neste filtro no momento.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="p-5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{room.title}</h3>
                  <Badge variant={room.status === 'LIVE' ? 'emerald' : 'secondary'}>
                    {LIVE_ROOM_STATUS_LABELS[room.status]}
                  </Badge>
                </div>
                {room.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatScheduledDate(room.scheduledAt)}
                  {room.course ? ` · ${room.course.title}` : ''}
                </p>
                <p className="text-xs text-muted-foreground">{room.participantCount} participantes</p>
                <Button
                  variant={room.status === 'LIVE' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/live/${room.id}`)}
                >
                  {room.status === 'LIVE' ? 'Assistir agora' : 'Ver detalhes'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}