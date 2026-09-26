export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  users: {
    profile: ['users', 'profile'] as const,
    publicProfile: (username: string) => ['users', 'publicProfile', username] as const,
  },
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.courses.lists(), filters].filter(Boolean) as readonly unknown[],
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    progress: (id: string) => [...queryKeys.courses.all, 'progress', id] as const,
    lesson: (courseId: string, lessonId: string) =>
      [...queryKeys.courses.all, 'lesson', courseId, lessonId] as const,
    note: (courseId: string, lessonId: string) =>
      [...queryKeys.courses.all, 'note', courseId, lessonId] as const,
  },
  authorization: {
    context: ['authorization', 'context'] as const,
    permissions: ['authorization', 'permissions'] as const,
    roles: ['authorization', 'roles'] as const,
    check: (permission: string) => ['authorization', 'check', permission] as const,
  },
  gamification: {
    xpProfile: ['gamification', 'xpProfile'] as const,
    rankings: (filters?: Record<string, unknown>) =>
      ['gamification', 'rankings', filters].filter(Boolean) as readonly unknown[],
    myRanking: ['gamification', 'myRanking'] as const,
    achievements: ['gamification', 'achievements'] as const,
    myAchievements: ['gamification', 'myAchievements'] as const,
    userXp: (userId: string) => ['gamification', 'xp', userId] as const,
  },
  shop: {
    state: ['shop', 'state'] as const,
  },
  inventory: {
    list: ['inventory'] as const,
  },
  exams: {
    list: (filters?: Record<string, unknown>) =>
      ['exams', 'list', filters].filter(Boolean) as readonly unknown[],
    detail: (slug: string) => ['exams', 'detail', slug] as const,
    history: (filters?: Record<string, unknown>) =>
      ['exams', 'history', filters].filter(Boolean) as readonly unknown[],
    stats: ['exams', 'stats'] as const,
    evolution: ['exams', 'evolution'] as const,
    subjectStats: ['exams', 'subjectStats'] as const,
  },
  health: {
    check: ['health'] as const,
  },
  certificates: {
    list: ['certificates'] as const,
    verify: (code: string) => ['certificates', 'verify', code] as const,
  },
  notifications: {
    list: (params?: { limit?: number; unreadOnly?: boolean }) =>
      ['notifications', 'list', params].filter(Boolean) as readonly unknown[],
    unreadCount: ['notifications', 'unreadCount'] as const,
  },
  instructor: {
    status: ['instructor', 'status'] as const,
    myCourses: ['instructor', 'myCourses'] as const,
    categories: ['instructor', 'categories'] as const,
  },
  liveRooms: {
    list: (status?: string) => ['liveRooms', 'list', status].filter(Boolean) as readonly unknown[],
    instructorRooms: ['liveRooms', 'instructorRooms'] as const,
    myCourses: ['liveRooms', 'instructorCourses'] as const,
    detail: (id: string) => ['liveRooms', 'detail', id] as const,
    messages: (id: string) => ['liveRooms', 'messages', id] as const,
  },
  moderation: {
    stats: ['moderation', 'stats'] as const,
    users: (params?: Record<string, string | number | undefined>) =>
      ['moderation', 'users', params].filter(Boolean) as readonly unknown[],
  },
}
