export const ENDPOINTS = {
  ROOT: '/',
  HEALTH: '/health',

  BETTER_AUTH: {
    SIGN_IN_EMAIL: '/api/auth/sign-in/email',
    SIGN_UP_EMAIL: '/api/auth/sign-up/email',
    GET_SESSION: '/api/auth/get-session',
    SIGN_OUT: '/api/auth/sign-out',
    FORGET_PASSWORD: '/api/auth/forget-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    SESSION: '/api/v1/auth/session',
    VERIFY_DEVICE: '/api/v1/auth/verify-device',
    RESEND_CODE: '/api/v1/auth/resend-device-code',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    OAUTH_GOOGLE: '/api/v1/auth/oauth/google',
    OAUTH_GITHUB: '/api/v1/auth/oauth/github',
    OAUTH_CALLBACK: (provider: string) => `/api/v1/auth/oauth/${provider}/callback`,
  },

  USERS: {
    ME: '/api/v1/users/me',
    XP: (userId: string) => `/api/v1/users/${userId}/xp`,
    PUBLIC_PROFILE: (username: string) => `/api/v1/users/${username}`,
  },

  COURSES: {
    LIST: '/api/v1/courses',
    DETAIL: (id: string) => `/api/v1/courses/${id}`,
    CREATE: '/api/v1/courses',
    UPDATE: (id: string) => `/api/v1/courses/${id}`,
    DELETE: (id: string) => `/api/v1/courses/${id}`,
    ENROLL: (id: string) => `/api/v1/courses/${id}/enroll`,
    PROGRESS: (id: string) => `/api/v1/courses/${id}/progress`,
    LESSON: (courseId: string, lessonId: string) => `/api/v1/courses/${courseId}/lessons/${lessonId}`,
    LESSON_COMPLETE: (courseId: string, lessonId: string) => `/api/v1/courses/${courseId}/lessons/${lessonId}/complete`,
    LESSON_FAVORITE: (courseId: string, lessonId: string) => `/api/v1/courses/${courseId}/lessons/${lessonId}/favorite`,
    LESSON_NOTE: (courseId: string, lessonId: string) => `/api/v1/courses/${courseId}/lessons/${lessonId}/note`,
  },

  AUTHORIZATION: {
    CONTEXT: '/api/v1/authorization/context',
    CHECK: (permission: string) => `/api/v1/authorization/check/${permission}`,
    PERMISSIONS: '/api/v1/authorization/permissions',
    PERMISSIONS_LIST: '/api/v1/authorization/permissions/list',
    ROLES: '/api/v1/authorization/roles',
  },

  INSTRUCTOR: {
    STATUS: '/api/v1/instructor/status',
    APPLY: '/api/v1/instructor/apply',
    MY_COURSES: '/api/v1/instructor/courses',
    CATEGORIES: '/api/v1/courses/categories',
  },

  LIVE_ROOMS: {
    LIST: '/api/v1/live-rooms',
    INSTRUCTOR_ROOMS: '/api/v1/live-rooms/instructor',
    INSTRUCTOR_COURSES: '/api/v1/live-rooms/instructor/courses',
    CREATE: '/api/v1/live-rooms',
    DETAIL: (id: string) => `/api/v1/live-rooms/${id}`,
    UPDATE: (id: string) => `/api/v1/live-rooms/${id}`,
    CANCEL: (id: string) => `/api/v1/live-rooms/${id}`,
    START: (id: string) => `/api/v1/live-rooms/${id}/start`,
    END: (id: string) => `/api/v1/live-rooms/${id}/end`,
    JOIN: (id: string) => `/api/v1/live-rooms/${id}/join`,
    LEAVE: (id: string) => `/api/v1/live-rooms/${id}/leave`,
    MESSAGES: (id: string) => `/api/v1/live-rooms/${id}/messages`,
  },

  MODERATION: {
    STATS: '/api/v1/moderation/stats',
    USERS: '/api/v1/moderation/users',
    BAN: (userId: string) => `/api/v1/moderation/users/${userId}/ban`,
    UNBAN: (userId: string) => `/api/v1/moderation/users/${userId}/unban`,
    MUTE: (userId: string) => `/api/v1/moderation/users/${userId}/mute`,
    UNMUTE: (userId: string) => `/api/v1/moderation/users/${userId}/unmute`,
    WARN: (userId: string) => `/api/v1/moderation/users/${userId}/warn`,
  },

  GAMIFICATION: {
    XP_PROFILE: '/api/v1/users/me/xp-profile',
    RANKINGS: '/api/v1/rankings',
    MY_RANKING: '/api/v1/rankings/me',
    ACHIEVEMENTS: '/api/v1/achievements',
    MY_ACHIEVEMENTS: '/api/v1/users/me/achievements',
  },

  SHOP: {
    STATE: '/api/v1/shop',
    PURCHASE: '/api/v1/shop/purchase',
    EQUIP: '/api/v1/shop/equip',
  },

  INVENTORY: {
    LIST: '/api/v1/inventory',
  },

  COMMUNITY: {
    FEED: (type: string) => `/api/v1/community/feed/${type}`,
    CREATE_DISCUSSION: '/api/v1/community/discussions',
    LIKE: (id: string) => `/api/v1/community/activities/${id}/like`,
    REACT: (id: string) => `/api/v1/community/activities/${id}/react`,
    COMMENTS: (id: string) => `/api/v1/community/activities/${id}/comments`,
    ADD_COMMENT: (id: string) => `/api/v1/community/activities/${id}/comments`,
    TRENDING_TAGS: '/api/v1/community/tags/trending',
    SUGGESTED_USERS: '/api/v1/community/users/suggested',
    FOLLOW: (id: string) => `/api/v1/community/users/${id}/follow`,
    REPORT: (id: string) => `/api/v1/community/activities/${id}/report`,
    DELETE: (id: string) => `/api/v1/community/activities/${id}`,
    PIN: (id: string) => `/api/v1/community/activities/${id}/pin`,
  },

  EXAMS: {
    LIST: '/api/v1/exams',
    DETAIL: (slug: string) => `/api/v1/exams/${slug}`,
    HISTORY: '/api/v1/exams/history',
    STATS: '/api/v1/exams/stats',
    EVOLUTION: '/api/v1/exams/evolution',
    SUBJECT_STATS: '/api/v1/exams/subject-stats',
    START: (slug: string) => `/api/v1/exams/${slug}/attempts`,
    SUBMIT: (slug: string, id: string) => `/api/v1/exams/${slug}/attempts/${id}`,
    RESULT: (slug: string, id: string) => `/api/v1/exams/${slug}/attempts/${id}/result`,
  },

  CERTIFICATES: {
    LIST: '/api/v1/certificates',
    ISSUE: '/api/v1/certificates',
    VERIFY: (code: string) => `/api/v1/certificates/verify/${code}`,
  },

  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/read-all',
  },

  CONVERSATIONS: {
    INBOX: '/api/v1/conversations',
    CREATE: '/api/v1/conversations',
    MESSAGES: (conversationId: string) => `/api/v1/conversations/${conversationId}/messages`,
    MARK_READ: (conversationId: string) => `/api/v1/conversations/${conversationId}/read`,
    SEND_MESSAGE: (conversationId: string) => `/api/v1/conversations/${conversationId}/messages`,
  },
} as const
