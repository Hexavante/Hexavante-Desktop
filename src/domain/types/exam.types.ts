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

export interface ExamDetail extends ExamListItem {
  questions: ExamQuestion[]
}

export interface ExamQuestion {
  id: string
  statement: string
  imageUrl: string | null
  imageDisplaySize: string | null
  orderNumber: number
  points: number
  type: 'MULTIPLE_CHOICE' | 'ESSAY'
  alternatives: ExamAlternative[]
}

export interface ExamAlternative {
  id: string
  text: string
  isCorrect?: boolean
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

export interface StartAttemptResponse {
  attemptId: string
  exam: {
    id: string
    title: string
    slug: string
    timeLimit: number | null
    questions: ExamQuestion[]
  }
}

export interface SubmitAttemptRequest {
  answers: Record<string, string | number>
}

export interface SubmitAttemptResponse {
  attemptId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  xpAwarded?: number
  coinsAwarded?: number
}

export interface AttemptResult {
  attemptId: string
  examId: string
  examTitle: string
  examSlug: string
  score: number
  correctAnswers: number
  totalQuestions: number
  finishedAt: string
  xpAwarded?: number
  coinsAwarded?: number
  questionResults: QuestionResult[]
}

export interface QuestionResult {
  questionId: string
  questionStatement: string
  userAnswer: string | number | null
  correctAnswer: string | number | null
  isCorrect: boolean
  points: number
  earnedPoints: number
  alternatives: ExamAlternative[]
}
