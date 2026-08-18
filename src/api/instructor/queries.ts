import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { instructorService } from '@/services/instructor.service'
import { staleTimes } from '@/app/queries/options'

export function useInstructorStatus() {
  return useQuery({
    queryKey: queryKeys.instructor.status,
    queryFn: () => instructorService.getStatus(),
    staleTime: staleTimes.NORMAL,
  })
}

export function useInstructorMyCourses() {
  return useQuery({
    queryKey: queryKeys.instructor.myCourses,
    queryFn: () => instructorService.getMyCourses(),
    staleTime: staleTimes.FAST,
  })
}

export function useCourseCategories() {
  return useQuery({
    queryKey: queryKeys.instructor.categories,
    queryFn: () => instructorService.getCategories(),
    staleTime: staleTimes.SLOW,
  })
}