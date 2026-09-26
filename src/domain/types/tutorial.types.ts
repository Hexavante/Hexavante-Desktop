export interface TutorialListItem {
  id: string
  slug?: string | null
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  duration?: number | string | null
  viewCount?: number | null
  authorName?: string | null
  categoryName?: string | null
}

export interface TutorialDetail {
  id: string
  slug?: string | null
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  videoUrl?: string | null
  duration?: number | string | null
  viewCount?: number | null
  authorName?: string | null
  categoryName?: string | null
  content?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TutorialQueryParams {
  page?: number
  limit?: number
  q?: string
}
