import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { liveRoomService } from '@/services/live-room.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type {
  CreateLiveRoomRequest,
  UpdateLiveRoomRequest,
} from '@/domain/types/live-room.types'

export function useCreateLiveRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateLiveRoomRequest) => liveRoomService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.instructorRooms })
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.list() })
      toast.success('Sala ao vivo criada!')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useUpdateLiveRoom(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateLiveRoomRequest) => liveRoomService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.instructorRooms })
      toast.success('Sala atualizada!')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useCancelLiveRoom(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => liveRoomService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.instructorRooms })
      toast.success('Sala cancelada')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useStartLiveRoom(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => liveRoomService.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.instructorRooms })
      toast.success('Transmissão iniciada!')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useEndLiveRoom(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => liveRoomService.end(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.instructorRooms })
      toast.success('Transmissão encerrada')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useJoinLiveRoom(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => liveRoomService.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.detail(id) })
      toast.success('Você entrou na sala!')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useLeaveLiveRoom(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => liveRoomService.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.detail(id) })
      toast.success('Você saiu da sala')
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}

export function useSendLiveMessage(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (message: string) => liveRoomService.sendMessage(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveRooms.messages(id) })
    },
    onError: (error) => toast.error(normalizeError(error).message),
  })
}