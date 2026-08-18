import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { courseService } from '@/services/course.service'
import { staleTimes } from '@/app/queries/options'
import type { CourseQueryParams } from '@/domain/types/course.types'

export function useCourses(params?: CourseQueryParams) {
  return useQuery({
    queryKey: queryKeys.courses.list(params as Record<string, unknown>),
    queryFn: () => courseService.list(params),
    staleTime: staleTimes.NORMAL,
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => courseService.getById(id),
    enabled: !!id,
    staleTime: staleTimes.SLOW,
  })
}

export function useCourseProgress(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.progress(id),
    queryFn: () => courseService.getProgress(id),
    enabled: !!id,
    staleTime: staleTimes.FAST,
  })
}

export function useLesson(courseId: string, lessonId: string) {
  return useQuery({
    queryKey: queryKeys.courses.lesson(courseId, lessonId),
    queryFn: () => courseService.getLesson(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: staleTimes.FAST,
  })
}

export function useLessonNote(courseId: string, lessonId: string) {
  return useQuery({
    queryKey: queryKeys.courses.note(courseId, lessonId),
    queryFn: () => courseService.getLessonNote(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: staleTimes.INSTANT,
  })
}
