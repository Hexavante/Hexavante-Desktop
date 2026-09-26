export interface ExamListItem {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  examType: string
  questionCount: number
  timeLimit: number | null
  isPremiumOnly: boolean
  userAttemptCount: number
}

// GET /api/v1/exams/:slugOrId -> { exam: {...} } (SEM questions)
export interface ExamDetail {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  examType: string
  questionCount: number
  timeLimit: number | null
  isPremiumOnly: boolean
  userAttemptCount?: number
}

export interface ExamAlternative {
  id: string
  text: string
  isCorrect?: boolean
}

// Questão como vem no start (alternativas SEM gabarito)
export interface ExamQuestion {
  id: string
  statement: string
  imageUrl: string | null
  orderNumber: number
  points: number
  type: string
  subject?: string | null
  alternatives: ExamAlternative[]
}

export interface ExamFilters {
  tipo?: string
  q?: string
  sort?: string
}

export interface AttemptHistory {
  id: string
  examId: string
  examTitle: string
  examSlug: string
  examType: string
  score: number
  correctAnswers: number
  totalQuestions: number
  finishedAt: string | null
}

export interface PaginatedAttempts {
  attempts: AttemptHistory[]
  page: number
  totalPages: number
  total: number
}

export interface ExamStats {
  totalAttempts: number
  averageScore: number
  bestScore: number
}

// POST /api/v1/exams/:slugOrId/start -> flat (SEM envelope exam:{...})
export interface StartAttemptResponse {
  attemptId: string
  examId: string
  title: string
  timeLimit: number | null
  startedAt: string
  questions: ExamQuestion[]
}

export interface SubmitAnswer {
  questionId: string
  alternativeId?: string
  essayAnswer?: string
}

// POST /api/v1/exams/submit body { attemptId, answers: [{ questionId, alternativeId? }] }
export interface SubmitAttemptRequest {
  attemptId: string
  answers: SubmitAnswer[]
}

// POST /api/v1/exams/submit -> O RESULTADO VEM AQUI (não há endpoint de resultado separado)
export interface SubmitAttemptResponse {
  attemptId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  percentage: number
  finishedAt: string
  xpAwarded?: number
  coinsAwarded?: number
  dailyMultiplier?: number
}

// Resultado exibido na tela de resultado (vem via router state do submit,
// ou montado a partir do histórico). Sem endpoint próprio.
export interface AttemptResult extends SubmitAttemptResponse {
  examTitle?: string
  examSlug?: string
}
