import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { courseService } from '@/services/course.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type { CreateCourseRequest, UpdateCourseRequest } from '@/domain/types/course.types'

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() })
      toast.success('Curso criado!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) => courseService.update(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(courseId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() })
      toast.success('Curso atualizado!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => courseService.remove(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() })
      toast.success('Curso removido')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useCompleteLesson(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => courseService.completeLesson(courseId, lessonId),
    onSuccess: (result, lessonId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lesson(courseId, lessonId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.progress(courseId) })
      const xp = result.xpAwarded ?? result.totalXpEarned ?? 0
      const coins = result.coinsAwarded ?? 0
      const parts: string[] = []
      if (xp > 0) parts.push(`+${xp} XP`)
      if (coins > 0) parts.push(`+${coins} moedas`)
      if (parts.length > 0) {
        toast.success(`Aula concluída! ${parts.join(' ')}`)
      } else {
        toast.success('Aula concluída!')
      }
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useToggleLessonFavorite(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => courseService.toggleLessonFavorite(courseId, lessonId),
    onSuccess: (_isFavorite, lessonId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lesson(courseId, lessonId) })
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useSaveLessonNote(courseId: string, lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => courseService.saveLessonNote(courseId, lessonId, content),
    onSuccess: () => {
      queryClient.setQueryData<string>(
        queryKeys.courses.note(courseId, lessonId),
        (old) => old ?? '',
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.note(courseId, lessonId) })
      toast.success('Nota salva!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => courseService.enroll(courseId),
    onSuccess: (_data, courseId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.progress(courseId) })
      toast.success('Matrícula realizada!')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}
