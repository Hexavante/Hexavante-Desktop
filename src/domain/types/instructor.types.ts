export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface InstructorApplication {
  id: string
  motivation: string
  experience: string
  portfolioUrl: string | null
  status: ApplicationStatus
  reviewedNotes: string | null
  createdAt: string
}

export interface InstructorStatus {
  application: InstructorApplication | null
}

export interface InstructorCourse {
  id: string
  title: string
  slug: string
  status: string
  thumbnailUrl: string | null
  coverImage: string | null
  level: string
  estimatedHours: number | null
  categoryName: string | null
  moduleCount: number
  enrollmentCount: number
  createdAt: string
}

export interface CourseCategory {
  id: string
  name: string
  description: string | null
}

export interface ApplyInstructorRequest {
  motivation: string
  experience: string
  portfolioUrl?: string
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Em análise',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
}

export const COURSE_STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  REVISION_REQUIRED: 'Revisão necessária',
}

export const COURSE_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
}