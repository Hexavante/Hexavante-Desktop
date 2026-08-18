import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  CourseListItem,
  CourseDetail,
  CourseQueryParams,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseEnrollment,
  CourseProgress,
  LessonDetail,
  LessonCompleteResult,
} from '@/domain/types/course.types'
import type { PaginatedResponse } from '@/domain/types/api.types'

export const courseService = {
  async list(params?: CourseQueryParams): Promise<PaginatedResponse<CourseListItem>> {
    const { data } = await api.get<PaginatedResponse<CourseListItem>>(ENDPOINTS.COURSES.LIST, {
      params,
    })
    return data
  },

  async getById(id: string): Promise<CourseDetail> {
    const { data } = await api.get<{ course: CourseDetail }>(ENDPOINTS.COURSES.DETAIL(id))
    return data.course
  },

  async create(body: CreateCourseRequest): Promise<CourseDetail> {
    const { data } = await api.post<{ course: CourseDetail }>(ENDPOINTS.COURSES.CREATE, body)
    return data.course
  },

  async update(id: string, body: UpdateCourseRequest): Promise<CourseDetail> {
    const { data } = await api.patch<{ course: CourseDetail }>(ENDPOINTS.COURSES.UPDATE(id), body)
    return data.course
  },

  async remove(id: string): Promise<void> {
    await api.delete(ENDPOINTS.COURSES.DELETE(id))
  },

  async enroll(id: string): Promise<CourseEnrollment> {
    const { data } = await api.post<{ enrollment: CourseEnrollment }>(ENDPOINTS.COURSES.ENROLL(id))
    return data.enrollment
  },

  async getProgress(id: string): Promise<CourseProgress> {
    const { data } = await api.get<{ progress: CourseProgress }>(ENDPOINTS.COURSES.PROGRESS(id))
    return data.progress
  },

  async getLesson(courseId: string, lessonId: string): Promise<LessonDetail> {
    const { data } = await api.get<LessonDetail>(ENDPOINTS.COURSES.LESSON(courseId, lessonId))
    return data
  },

  async completeLesson(courseId: string, lessonId: string): Promise<LessonCompleteResult> {
    const { data } = await api.post<LessonCompleteResult>(
      ENDPOINTS.COURSES.LESSON_COMPLETE(courseId, lessonId),
    )
    return data
  },

  async toggleLessonFavorite(courseId: string, lessonId: string): Promise<boolean> {
    const { data } = await api.post<{ isFavorite: boolean }>(
      ENDPOINTS.COURSES.LESSON_FAVORITE(courseId, lessonId),
    )
    return data.isFavorite
  },

  async getLessonNote(courseId: string, lessonId: string): Promise<string> {
    const { data } = await api.get<{ content: string }>(
      ENDPOINTS.COURSES.LESSON_NOTE(courseId, lessonId),
    )
    return data.content
  },

  async saveLessonNote(courseId: string, lessonId: string, content: string): Promise<void> {
    await api.put(ENDPOINTS.COURSES.LESSON_NOTE(courseId, lessonId), { content })
  },
}
