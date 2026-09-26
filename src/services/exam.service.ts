import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  ExamListItem,
  ExamDetail,
  ExamFilters,
  PaginatedAttempts,
  ExamStats,
  StartAttemptResponse,
  SubmitAttemptResponse,
  SubmitAttemptRequest,
} from '@/domain/types/exam.types'

export const examService = {
  async list(filters?: ExamFilters): Promise<ExamListItem[]> {
    const { data } = await api.get<ExamListItem[]>(ENDPOINTS.EXAMS.LIST, { params: filters })
    return data
  },

  // GET /api/v1/exams/:slugOrId -> { exam: {...} } (sem questions)
  async getDetail(slug: string): Promise<ExamDetail> {
    const { data } = await api.get<{ exam: ExamDetail }>(ENDPOINTS.EXAMS.DETAIL(slug))
    return data.exam
  },

  async getHistory(filters?: ExamFilters & { page?: number }): Promise<PaginatedAttempts> {
    const { data } = await api.get<PaginatedAttempts>(ENDPOINTS.EXAMS.HISTORY, { params: filters })
    return data
  },

  async getStats(): Promise<ExamStats> {
    const { data } = await api.get<ExamStats>(ENDPOINTS.EXAMS.STATS)
    return data
  },

  async getEvolution(): Promise<{ date: string; score: number }[]> {
    const { data } = await api.get<{ date: string; score: number }[]>(ENDPOINTS.EXAMS.EVOLUTION)
    return data
  },

  async getSubjectStats(): Promise<{ subject: string; correct: number; total: number }[]> {
    const { data } = await api.get<{ subject: string; correct: number; total: number }[]>(ENDPOINTS.EXAMS.SUBJECT_STATS)
    return data
  },

  // POST /api/v1/exams/:slugOrId/start -> flat { attemptId, examId, title, timeLimit, startedAt, questions }
  // 403 { success: false, error: 'Conteúdo Premium' } quando premium sem acesso.
  async startAttempt(slug: string): Promise<StartAttemptResponse> {
    const { data } = await api.post<StartAttemptResponse>(ENDPOINTS.EXAMS.START(slug))
    return data
  },

  // POST /api/v1/exams/submit body { attemptId, answers: [{ questionId, alternativeId? }] }
  // -> resultado final (não há endpoint de resultado separado).
  async submitAttempt(payload: SubmitAttemptRequest): Promise<SubmitAttemptResponse> {
    const { data } = await api.post<SubmitAttemptResponse>(ENDPOINTS.EXAMS.SUBMIT, payload)
    return data
  },
}
