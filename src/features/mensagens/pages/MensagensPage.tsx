import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useInbox, useCreateConversation } from '@/api/conversations/queries'
import { Search, UserPlus, MessageSquare, Clock, Check } from 'lucide-react'

export default function MensagensPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [newConversationUsername, setNewConversationUsername] = useState('')
  const { data, isLoading, isError, refetch } = useInbox()
  const createConversation = useCreateConversation()

  const conversations = data?.conversations ?? []
  const unreadCount = data?.unreadCount ?? 0

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newConversationUsername.trim()) return
    try {
      const result = await createConversation.mutateAsync({ username: newConversationUsername.trim() })
      setShowNewConversation(false)
      setNewConversationUsername('')
      navigate(`/mensagens/${result.conversationId}`)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('pt-BR')
  }

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.otherUser.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return <LoadingScreen />

  if (isError) {
    return (
      <div className="hx-page">
        <PageHeader title="Mensagens" description="Caixa de entrada" />
        <EmptyState
          title="Erro ao carregar mensagens"
          description="Verifique sua conexão e tente novamente."
          action={{ label: 'Tentar novamente', onClick: () => refetch() }}
        />
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Mensagens"
        description={unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Caixa de entrada'}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <MessageSquare className="h-4 w-4 mr-1" /> Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowNewConversation(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Nova
          </Button>
        </div>
      </PageHeader>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Buscar conversas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {showNewConversation && (
        <Card className="mb-4 p-4 border-teal-500/30 bg-teal-500/5">
          <form onSubmit={handleStartConversation} className="flex gap-2">
            <Input
              placeholder="Nome de usuário"
              value={newConversationUsername}
              onChange={(e) => setNewConversationUsername(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" disabled={createConversation.isPending}>
              {createConversation.isPending ? 'Iniciando...' : 'Iniciar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowNewConversation(false)}>
              Cancelar
            </Button>
          </form>
        </Card>
      )}

      {filteredConversations.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
          description={searchQuery ? 'Tente outro termo de busca' : 'Inicie uma conversa com outro usuário'}
          action={{
            label: 'Nova Conversa',
            onClick: () => setShowNewConversation(true),
          }}
        />
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conversation) => {
            const isUnread = conversation.unreadCount > 0
            const lastMessage = conversation.lastMessage
            const otherUser = conversation.otherUser

            return (
              <Card
                key={conversation.id}
                className={`flex items-center gap-4 p-4 cursor-pointer transition-all ${isUnread ? 'bg-white/[0.03] ring-1 ring-teal-500/20' : 'bg-white/[0.02]'} hover:bg-white/[0.04]`}
                onClick={() => navigate(`/mensagens/${conversation.id}`)}
              >
                <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden">
                  <span className="text-xl font-bold text-cyan-400">
                    {otherUser.fullName.charAt(0).toUpperCase()}
                  </span>
                  {isUnread && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
                      {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-white truncate ${isUnread ? '' : 'text-slate-300'}`}>
                      {otherUser.fullName}
                    </h4>
                    <span className={`text-xs ${isUnread ? 'text-teal-400' : 'text-slate-500'}`}>
                      {getTimeAgo(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-sm truncate ${isUnread ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                      {lastMessage ? `${lastMessage.senderId === otherUser.id ? '' : 'Você: '}${lastMessage.body}` : 'Sem mensagens ainda'}
                    </p>
                    {isUnread && <Check className="h-4 w-4 text-teal-400 flex-shrink-0 ml-2" />}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 truncate">@{otherUser.username}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}