export interface FeedActivity {
  id: string
  type: string
  user: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
  metadata: {
    title?: string
    body?: string
  }
  tags: string[]
  likes: number
  comments: number
  reactions: Record<string, number>
  likedByViewer: boolean
  viewerReactions: string[]
  isPinned: boolean
  createdAt: string
}

export interface ActivityComment {
  id: string
  content: string
  isAccepted: boolean
  likes: number
  likedByViewer: boolean
  user: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
  createdAt: string
}

export interface TrendingTag {
  tag: string
  count: number
}

export interface SuggestedUser {
  id: string
  username: string | null
  fullName: string
  avatarUrl: string | null
  followerCount: number
}
