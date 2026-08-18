export interface DirectMessage {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: string
  readAt: string | null
  sender: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
}

export interface Conversation {
  id: string
  participantAId: string
  participantBId: string
  lastMessageAt: string | null
  createdAt: string
  participantA: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
  participantB: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
  messages?: DirectMessage[]
}

export interface InboxConversation {
  id: string
  otherUser: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
  lastMessage: {
    id: string
    body: string
    senderId: string
    createdAt: string
    readAt: string | null
  } | null
  unreadCount: number
  lastMessageAt: string | null
  createdAt: string
}

export interface InboxResponse {
  success: true
  conversations: InboxConversation[]
  unreadCount: number
}

export interface CreateConversationInput {
  recipientUserId?: string
  username?: string
}

export interface CreateConversationResponse {
  success: true
  conversationId: string
  otherUser: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
}

export interface MessagesResponse {
  success: true
  messages: DirectMessage[]
}

export interface SendMessageInput {
  body: string
}