export type LiveRoomStatus = 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED'

export interface LiveRoomSummary {
  id: string
  title: string
  description: string | null
  videoUrl: string | null
  videoProvider: string | null
  scheduledAt: string
  startedAt: string | null
  endedAt: string | null
  status: LiveRoomStatus
  maxParticipants: number | null
  participantCount: number
  course: { id: string; title: string; slug: string } | null
  instructor: { id: string; username: string | null; fullName: string }
}

export interface ActiveParticipant {
  userId: string
  username: string | null
  fullName: string
  joinedAt: string
}

export interface LiveRoomDetail extends LiveRoomSummary {
  isInstructor: boolean
  isParticipant: boolean
  activeParticipants: ActiveParticipant[]
}

export interface LiveChatMessage {
  id: string
  roomId: string
  userId: string
  message: string
  createdAt: string
  user: { id: string; username: string | null; fullName: string }
}

export interface RoomCourseOption {
  id: string
  title: string
  slug: string
}

export interface CreateLiveRoomRequest {
  title: string
  description?: string
  courseId?: string
  videoUrl?: string
  videoProvider?: string
  scheduledAt: string
  maxParticipants?: number
}

export type UpdateLiveRoomRequest = Partial<CreateLiveRoomRequest> & { status?: LiveRoomStatus }

export const LIVE_ROOM_STATUS_LABELS: Record<LiveRoomStatus, string> = {
  SCHEDULED: 'Agendada',
  LIVE: 'Ao vivo',
  ENDED: 'Encerrada',
  CANCELLED: 'Cancelada',
}

export function formatScheduledDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}