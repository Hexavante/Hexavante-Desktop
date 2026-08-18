import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  InboxConversation,
  InboxResponse,
  CreateConversationResponse,
  DirectMessage,
  MessagesResponse,
  CreateConversationInput,
  SendMessageInput,
} from './types'

export const conversationsApi = {
  async getInbox(): Promise<{ conversations: InboxConversation[]; unreadCount: number }> {
    const { data } = await api.get<InboxResponse>(ENDPOINTS.CONVERSATIONS.INBOX)
    return { conversations: data.conversations, unreadCount: data.unreadCount }
  },

  async createConversation(input: CreateConversationInput): Promise<CreateConversationResponse> {
    const { data } = await api.post<CreateConversationResponse>(ENDPOINTS.CONVERSATIONS.CREATE, input)
    return data
  },

  async getMessages(
    conversationId: string,
    params?: { since?: string; limit?: number },
  ): Promise<DirectMessage[]> {
    const { data } = await api.get<MessagesResponse>(ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId), { params })
    return data.messages
  },

  async markAsRead(conversationId: string): Promise<void> {
    await api.patch(ENDPOINTS.CONVERSATIONS.MARK_READ(conversationId))
  },

  async sendMessage(conversationId: string, body: string): Promise<DirectMessage> {
    const { data } = await api.post<{ success: true; message: DirectMessage }>(
      ENDPOINTS.CONVERSATIONS.SEND_MESSAGE(conversationId),
      { body },
    )
    return data.message
  },
}