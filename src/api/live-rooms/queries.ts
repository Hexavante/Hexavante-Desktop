import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { liveRoomService } from '@/services/live-room.service'
import { staleTimes } from '@/app/queries/options'

export function useLiveRooms(status?: string) {
  return useQuery({
    queryKey: queryKeys.liveRooms.list(status),
    queryFn: () => liveRoomService.list(status),
    staleTime: status === 'live' ? staleTimes.FAST : staleTimes.NORMAL,
  })
}

export function useInstructorRooms() {
  return useQuery({
    queryKey: queryKeys.liveRooms.instructorRooms,
    queryFn: () => liveRoomService.instructorRooms(),
    staleTime: staleTimes.FAST,
  })
}

export function useInstructorRoomCourses() {
  return useQuery({
    queryKey: queryKeys.liveRooms.myCourses,
    queryFn: () => liveRoomService.instructorCourses(),
    staleTime: staleTimes.SLOW,
  })
}

export function useLiveRoomDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.liveRooms.detail(id),
    queryFn: () => liveRoomService.detail(id),
    enabled: !!id,
    staleTime: staleTimes.FAST,
  })
}

export function useLiveRoomMessages(id: string, since?: string) {
  return useQuery({
    queryKey: queryKeys.liveRooms.messages(id),
    queryFn: () => liveRoomService.messages(id, since),
    enabled: !!id,
    staleTime: staleTimes.FAST,
  })
}