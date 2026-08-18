import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  InstructorStatus,
  InstructorApplication,
  InstructorCourse,
  CourseCategory,
  ApplyInstructorRequest,
} from '@/domain/types/instructor.types'

export const instructorService = {
  async getStatus(): Promise<InstructorStatus> {
    const { data } = await api.get<InstructorStatus>(ENDPOINTS.INSTRUCTOR.STATUS)
    return data
  },

  async apply(body: ApplyInstructorRequest): Promise<InstructorApplication> {
    const { data } = await api.post<{ application: InstructorApplication }>(
      ENDPOINTS.INSTRUCTOR.APPLY,
      body,
    )
    return data.application
  },

  async getCategories(): Promise<CourseCategory[]> {
    const { data } = await api.get<{ categories: CourseCategory[] }>(
      ENDPOINTS.INSTRUCTOR.CATEGORIES,
    )
    return data.categories
  },

  async getMyCourses(): Promise<InstructorCourse[]> {
    const { data } = await api.get<{ courses: InstructorCourse[] }>(
      ENDPOINTS.INSTRUCTOR.MY_COURSES,
    )
    return data.courses
  },
}