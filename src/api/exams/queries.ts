import { useQuery, useMutation } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { examService } from '@/services/exam.service'
import { staleTimes } from '@/app/queries/options'
import type { ExamFilters, SubmitAttemptRequest } from '@/domain/types/exam.types'
import { AppError } from '@/adapters/error/app-error'
import { toast } from 'sonner'

function isPremiumForbidden(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.status === 403
  }
  return false
}

export function useExams(filters?: ExamFilters) {
  return useQuery({
    queryKey: queryKeys.exams.list(filters as Record<string, unknown>),
    queryFn: () => examService.list(filters),
    staleTime: staleTimes.NORMAL,
  })
}

export function useExamDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.exams.detail(slug),
    queryFn: () => examService.getDetail(slug),
    enabled: !!slug,
    staleTime: staleTimes.NORMAL,
  })
}

export function useExamHistory(filters?: ExamFilters & { page?: number }) {
  return useQuery({
    queryKey: queryKeys.exams.history(filters as Record<string, unknown>),
    queryFn: () => examService.getHistory(filters),
    staleTime: staleTimes.FAST,
  })
}

export function useExamStats() {
  return useQuery({
    queryKey: queryKeys.exams.stats,
    queryFn: () => examService.getStats(),
    staleTime: staleTimes.NORMAL,
  })
}

export function useExamEvolution() {
  return useQuery({
    queryKey: queryKeys.exams.evolution,
    queryFn: () => examService.getEvolution(),
    staleTime: staleTimes.NORMAL,
  })
}

export function useExamSubjectStats() {
  return useQuery({
    queryKey: queryKeys.exams.subjectStats,
    queryFn: () => examService.getSubjectStats(),
    staleTime: staleTimes.NORMAL,
  })
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: (slug: string) => examService.startAttempt(slug),
    onError: (error: Error) => {
      if (isPremiumForbidden(error)) {
        toast.error('Conteúdo Premium — ative o trial na loja')
      } else {
        toast.error(error.message || 'Erro ao iniciar simulado')
      }
    },
  })
}

export function useSubmitAttempt() {
  return useMutation({
    mutationFn: (payload: SubmitAttemptRequest) => examService.submitAttempt(payload),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar simulado')
    },
  })
}
