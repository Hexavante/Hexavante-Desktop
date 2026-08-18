export type League = 'BRONZE' | 'SILVER' | 'GOLD'

export interface RankingEntry {
  rank: number
  userId: string
  username: string
  fullName: string
  avatarUrl: string | null
  level: number
  totalXp: number
  league: League
}

export interface RankingSeason {
  seasonKey: string
  startsAt: string
  endsAt: string
}

export interface MyRanking {
  rank: number
  seasonKey: string
  league: League
  totalXp: number
  level: number
}

export interface XpTransaction {
  id: string
  amount: number
  source: string
  sourceId: string
  description: string
  createdAt: string
}

export interface XpProfile {
  level: number
  currentXp: number
  totalXp: number
  xpToNextLevel: number
  progressPercent: number
  league: League
}

export interface Achievement {
  key: string
  name: string
  description: string
}

export interface UserAchievement extends Achievement {
  unlocked: boolean
  unlockedAt: string | null
}
