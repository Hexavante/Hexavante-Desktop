import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  LiveRoomSummary,
  LiveRoomDetail,
  LiveChatMessage,
  RoomCourseOption,
  CreateLiveRoomRequest,
  UpdateLiveRoomRequest,
} from '@/domain/types/live-room.types'

export const liveRoomService = {
  async list(status?: string): Promise<LiveRoomSummary[]> {
    const { data } = await api.get<{ rooms: LiveRoomSummary[] }>(ENDPOINTS.LIVE_ROOMS.LIST, {
      params: status ? { status } : {},
    })
    return data.rooms
  },

  async instructorRooms(): Promise<LiveRoomSummary[]> {
    const { data } = await api.get<{ rooms: LiveRoomSummary[] }>(
      ENDPOINTS.LIVE_ROOMS.INSTRUCTOR_ROOMS,
    )
    return data.rooms
  },

  async instructorCourses(): Promise<RoomCourseOption[]> {
    const { data } = await api.get<{ courses: RoomCourseOption[] }>(
      ENDPOINTS.LIVE_ROOMS.INSTRUCTOR_COURSES,
    )
    return data.courses
  },

  async detail(id: string): Promise<LiveRoomDetail> {
    const { data } = await api.get<{ room: LiveRoomDetail }>(
      ENDPOINTS.LIVE_ROOMS.DETAIL(id),
    )
    return data.room
  },

  async create(body: CreateLiveRoomRequest): Promise<LiveRoomSummary> {
    const { data } = await api.post<{ room: LiveRoomSummary }>(ENDPOINTS.LIVE_ROOMS.CREATE, body)
    return data.room
  },

  async update(id: string, body: UpdateLiveRoomRequest): Promise<LiveRoomSummary> {
    const { data } = await api.patch<{ room: LiveRoomSummary }>(
      ENDPOINTS.LIVE_ROOMS.UPDATE(id),
      body,
    )
    return data.room
  },

  async cancel(id: string): Promise<void> {
    await api.delete(ENDPOINTS.LIVE_ROOMS.CANCEL(id))
  },

  async start(id: string): Promise<LiveRoomSummary> {
    const { data } = await api.post<{ room: LiveRoomSummary }>(ENDPOINTS.LIVE_ROOMS.START(id))
    return data.room
  },

  async end(id: string): Promise<LiveRoomSummary> {
    const { data } = await api.post<{ room: LiveRoomSummary }>(ENDPOINTS.LIVE_ROOMS.END(id))
    return data.room
  },

  async join(id: string): Promise<void> {
    await api.post(ENDPOINTS.LIVE_ROOMS.JOIN(id))
  },

  async leave(id: string): Promise<void> {
    await api.post(ENDPOINTS.LIVE_ROOMS.LEAVE(id))
  },

  async messages(id: string, since?: string): Promise<LiveChatMessage[]> {
    const { data } = await api.get<{ messages: LiveChatMessage[] }>(
      ENDPOINTS.LIVE_ROOMS.MESSAGES(id),
      { params: since ? { since } : {} },
    )
    return data.messages
  },

  async sendMessage(id: string, message: string): Promise<LiveChatMessage> {
    const { data } = await api.post<{ message: LiveChatMessage }>(
      ENDPOINTS.LIVE_ROOMS.MESSAGES(id),
      { message },
    )
    return data.message
  },
}