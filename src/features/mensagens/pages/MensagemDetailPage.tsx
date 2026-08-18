import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useConversationMessages, useSendMessage, useMarkConversationRead, useInbox } from '@/api/conversations/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { Send, ArrowLeft, MoreVertical, Check, CheckCheck, MessageSquare } from 'lucide-react'

interface ConversationDetailProps {
  conversationId: string
  otherUser: {
    id: string
    username: string | null
    fullName: string
    avatarUrl: string | null
  }
}

function ConversationDetailInner({ conversationId, otherUser }: ConversationDetailProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState(false)

  const { data: messages, isLoading, isFetching } = useConversationMessages(conversationId, { limit: 50 })
  const sendMessage = useSendMessage()
  const markAsRead = useMarkConversationRead()
  const { refetch: refetchInbox } = useInbox()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages && messages.length > 0) {
      const hasUnread = messages.some(m => !m.readAt && m.senderId !== user?.id)
      if (hasUnread) {
        markAsRead.mutate(conversationId, {
          onSuccess: () => refetchInbox(),
        })
      }
    }
  }, [messages, conversationId, user?.id, markAsRead, refetchInbox])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || sendMessage.isPending) return

    const body = messageInput.trim()
    setMessageInput('')
    sendMessage.mutate({ conversationId, body }, {
      onError: () => setMessageInput(body),
    })
  }

  const getTimeString = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const getDateString = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Hoje'
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem'
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="hx-page flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mensagens')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title={otherUser.fullName}
          description={`@{otherUser.username}`}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-white/[0.05]"
            aria-label="Opções da conversa"
          >
            <MoreVertical className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}>
          <div className="absolute right-4 top-12 w-48 bg-slate-900 rounded-lg border border-white/10 shadow-lg py-1 z-20">
            <button
              onClick={() => { setShowMenu(false); navigate(`/perfil/${otherUser.username}`) }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/[0.05]"
            >
              Ver perfil
            </button>
            <button
              onClick={() => { setShowMenu(false); } }
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/[0.05]"
            >
              Bloquear usuário
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pb-4" ref={messagesEndRef}>
        {messages && messages.length > 0 ? (
          <>
            {(() => {
              const grouped: Record<string, typeof messages> = {}
              messages.forEach(msg => {
                const dateKey = getDateString(msg.createdAt)
                if (!grouped[dateKey]) grouped[dateKey] = []
                grouped[dateKey].push(msg)
              })
              return Object.entries(grouped).map(([date, dayMessages]) => (
                <div key={date} className="space-y-2">
                  <div className="flex items-center gap-2 my-4 text-center">
                    <div className="flex-1 border-t border-white/10" />
                    <span className="px-3 py-0.5 text-xs text-slate-500 bg-white/[0.03] rounded-full">{date}</span>
                    <div className="flex-1 border-t border-white/10" />
                  </div>
                  {dayMessages.map((message) => {
                    const isOwn = message.senderId === user?.id
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-cyan-500/20 text-white rounded-br-none'
                              : 'bg-white/[0.05] text-slate-300 rounded-bl-none'
                          }`}
                        >
                          {!isOwn && (
                            <p className="text-xs text-slate-500 mb-1 ml-1">{message.sender.fullName}</p>
                          )}
                          <p className="whitespace-pre-wrap">{message.body}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? 'text-teal-400' : 'text-slate-500'} justify-end`}>
                            <span>{getTimeString(message.createdAt)}</span>
                            {isOwn && (
                              <>
                                {message.readAt ? (
                                  <CheckCheck className="h-3.5 w-3.5" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            })()}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <MessageSquare className="h-12 w-12 mb-4 text-slate-700" />
            <p className="text-lg">Nenhuma mensagem ainda</p>
            <p className="text-sm">Seja o primeiro a enviar uma mensagem</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Digite uma mensagem..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1"
            disabled={sendMessage.isPending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!messageInput.trim() || sendMessage.isPending}
            size="icon"
            className="p-2"
            aria-label="Enviar mensagem"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function MensagemDetailPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const [conversationData, setConversationData] = useState<{
    otherUser: {
      id: string
      username: string | null
      fullName: string
      avatarUrl: string | null
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) {
      navigate('/mensagens')
      return
    }

    const fetchConversation = async () => {
      try {
        const inbox = await fetch(`/api/v1/conversations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('sessionToken')}` },
        }).then(res => res.json())

        type InboxConversation = {
          id: string
          otherUser: {
            id: string
            username: string | null
            fullName: string
            avatarUrl: string | null
          }
        }
        const conv = inbox.conversations?.find((c: InboxConversation) => c.id === conversationId)
        if (conv) {
          setConversationData({
            otherUser: {
              id: conv.otherUser.id,
              username: conv.otherUser.username,
              fullName: conv.otherUser.fullName,
              avatarUrl: conv.otherUser.avatarUrl,
            },
          })
        } else {
          navigate('/mensagens')
        }
      } catch (error) {
        navigate('/mensagens')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversation()
  }, [conversationId, navigate])

  if (isLoading) return <LoadingScreen />
  if (!conversationData) return <LoadingScreen />

  return <ConversationDetailInner conversationId={conversationId!} otherUser={conversationData.otherUser} />
}