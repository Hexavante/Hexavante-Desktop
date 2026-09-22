export type CourseType = 'FREE' | 'PAID' | 'PREMIUM'
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type CourseStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED'
export type ProgressionType = 'FREE' | 'PROGRESSIVE'

export interface CourseListItem {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  thumbnailUrl: string | null
  courseType: CourseType
  level: CourseLevel
  estimatedHours: number | null
  totalModules: number
  totalLessons: number
  instructorName: string | null
  createdAt: string
}

export interface CourseDetail {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string | null
  thumbnailUrl: string | null
  coverImage: string | null
  courseType: CourseType
  level: CourseLevel
  estimatedHours: number | null
  progressionType: ProgressionType
  status: CourseStatus
  totalModules: number
  totalLessons: number
  instructorName: string | null
  modules: ModuleDto[]
  createdAt: string
  updatedAt: string
}

export interface ModuleDto {
  id: string
  title: string
  description: string | null
  orderNumber: number
  lessons: LessonDto[]
}

export interface LessonDto {
  id: string
  title: string
  description: string | null
  duration: number | null
  orderNumber: number
}

export interface CourseQueryParams {
  page?: number
  limit?: number
  level?: CourseLevel
  courseType?: CourseType
  categoryId?: string
  search?: string
}

export interface CreateCourseRequest {
  title: string
  slug: string
  categoryId: string
  shortDescription?: string
  description?: string
  thumbnailUrl?: string
  coverImage?: string
  courseType?: CourseType
  level?: CourseLevel
  estimatedHours?: number
  progressionType?: ProgressionType
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  status?: CourseStatus
}

export interface CourseEnrollment {
  id: string
  enrolledAt: string
}

export interface CourseProgress {
  courseId: string
  enrollmentId: string
  progress: number
  enrolledAt: string
  completedAt: string | null
  modules: ModuleProgressDto[]
}

export interface ModuleProgressDto {
  moduleId: string
  title: string
  orderNumber: number
  totalLessons: number
  completedLessons: number
  lessons: LessonProgressDto[]
}

export interface LessonProgressDto {
  lessonId: string
  title: string
  orderNumber: number
  completed: boolean
  completedAt: string | null
}

export interface CourseMaterialDto {
  id: string
  title: string
  fileUrl: string
  fileType: string
}

export interface LessonDetail {
  course: {
    id: string
    title: string
    slug: string
    progressionType: ProgressionType
    estimatedHours: number | null
  }
  enrollment: { id: string; progress: number }
  lesson: {
    id: string
    title: string
    description: string | null
    videoUrl: string | null
    videoProvider: string | null
    durationMinutes: number | null
    orderNumber: number
    moduleId: string
    isCompleted: boolean
  }
  module: {
    id: string
    title: string
    orderNumber: number
    materials: CourseMaterialDto[]
  } | null
  sidebarLessons: SidebarLessonDto[]
  learning: LessonLearningContext
  isCompleted: boolean
}

export interface SidebarLessonDto {
  id: string
  title: string
  orderNumber: number
  moduleId: string
  moduleOrder: number
  moduleTitle: string
  isCompleted: boolean
}

export interface LessonLearningContext {
  completedLessons: number
  totalLessons: number
  currentLessonNumber: number
  remainingMinutes: number
  remainingLabel: string
  nextLesson: { id: string; title: string } | null
  isFavorite: boolean
  note: string | null
  favoriteLessonIds: string[]
}

export interface LessonCompleteResult {
  progress: number
  totalXpEarned: number
  xpAwarded?: number
  coinsAwarded?: number
  newLevels: Array<{ level: number; leveledUp: boolean }>
}
