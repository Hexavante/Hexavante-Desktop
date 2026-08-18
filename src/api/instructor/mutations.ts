import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { instructorService } from '@/services/instructor.service'
import { normalizeError } from '@/adapters/error/error-normalizer'
import { queryKeys } from '@/api/keys'
import type { ApplyInstructorRequest } from '@/domain/types/instructor.types'

export function useApplyInstructor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ApplyInstructorRequest) => instructorService.apply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instructor.status })
      toast.success('Solicitação enviada! Em análise.')
    },
    onError: (error) => {
      const appError = normalizeError(error)
      toast.error(appError.message)
    },
  })
}