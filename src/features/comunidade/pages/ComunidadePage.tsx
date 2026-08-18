import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useFeed, useTrendingTags, useSuggestedUsers } from '@/api/community/queries'
import { useCreateDiscussion, useToggleLike, useAddComment } from '@/api/community/mutations'
import { useAuth } from '@/app/hooks/use-auth'
import { Heart, MessageCircle } from 'lucide-react'

export default function ComunidadePage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'explore' | 'following' | 'questions'>('explore')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [commentText, setCommentText] = useState<Record<string, string>>({})
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})

  const { data: activities, isLoading } = useFeed(tab)
  const { data: trendingTags } = useTrendingTags()
  const { data: suggestedUsers } = useSuggestedUsers()
  const createDiscussion = useCreateDiscussion()
  const toggleLike = useToggleLike()
  const addComment = useAddComment()

  if (isLoading) return <LoadingScreen />

  function handleCreateDiscussion(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    createDiscussion.mutate({ title: title.trim(), body: body.trim() })
    setTitle('')
    setBody('')
    setShowForm(false)
  }

  function handleAddComment(activityId: string) {
    const content = commentText[activityId]?.trim()
    if (!content) return
    addComment.mutate({ activityId, content })
    setCommentText((prev) => ({ ...prev, [activityId]: '' }))
  }

  return (
    <div className="hx-page">
      <PageHeader title="Comunidade" description="Conecte-se com outros estudantes" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {user && (
            <Card  className="mb-4">
              {showForm ? (
                <form onSubmit={handleCreateDiscussion} className="space-y-3">
                  <input
                    className="hx-input"
                    placeholder="Título da discussão"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    required
                  />
                  <textarea
                    className="hx-input min-h-[100px]"
                    placeholder="Compartilhe sua dúvida ou ideia..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={createDiscussion.isPending}>
                      {createDiscussion.isPending ? 'Publicando...' : 'Publicar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <Button onClick={() => setShowForm(true)}>
                  Nova discussão
                </Button>
              )}
            </Card>
          )}

          <div className="mb-4 flex gap-2">
            {(['explore', 'following', 'questions'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition ${
                  tab === t
                    ? 'bg-teal-500/20 text-teal-200'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                }`}
              >
                {t === 'explore' ? 'Explorar' : t === 'following' ? 'Seguindo' : 'Perguntas'}
              </button>
            ))}
          </div>

          {activities?.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-slate-400">Nenhuma publicação ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities?.map((activity) => (
                <Card key={activity.id} >
                  <div className="flex gap-3">
                    <Link to={`/perfil/${activity.user.username}`} className="shrink-0">
                      <Avatar src={activity.user.avatarUrl} alt={activity.user.username ?? ''} size="sm" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/perfil/${activity.user.username}`}
                          className="text-sm font-semibold text-white hover:underline"
                        >
                          {activity.user.fullName}
                        </Link>
                        <span className="text-xs text-slate-500">
                          @{activity.user.username} · {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {activity.metadata.title && (
                        <h3 className="mt-2 text-base font-bold text-white">
                          {activity.metadata.title}
                        </h3>
                      )}
                      {activity.metadata.body && (
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                          {activity.metadata.body}
                        </p>
                      )}

                      {activity.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {activity.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => toggleLike.mutate(activity.id)}
                          className={`inline-flex items-center gap-1 text-xs font-medium transition ${
                            activity.likedByViewer ? 'text-rose-300' : 'text-slate-500 hover:text-rose-200'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${activity.likedByViewer ? 'fill-current' : ''}`} />
                          {activity.likes}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenComments((prev) => ({ ...prev, [activity.id]: !prev[activity.id] }))
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-200 transition"
                        >
                          <MessageCircle className="h-4 w-4" /> {activity.comments}
                        </button>
                      </div>

                      {openComments[activity.id] && (
                        <div className="mt-3 border-t border-white/5 pt-3">
                          {user && (
                            <div className="mb-3 flex gap-2">
                              <input
                                className="hx-input flex-1"
                                placeholder="Escreva uma resposta..."
                                value={commentText[activity.id] ?? ''}
                                onChange={(e) =>
                                  setCommentText((prev) => ({ ...prev, [activity.id]: e.target.value }))
                                }
                                maxLength={500}
                              />
                              <Button
                                size="sm"
                                disabled={!commentText[activity.id]?.trim() || addComment.isPending}
                                onClick={() => handleAddComment(activity.id)}
                              >
                                {addComment.isPending ? '...' : 'Enviar'}
                              </Button>
                            </div>
                          )}

                          <p className="text-xs text-slate-500">
                            Faça login para ver e escrever comentários.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!user && (
            <Card  className="mt-4 text-center">
              <p className="text-sm text-slate-400">
                <Link to="/login?callbackUrl=/comunidade" className="font-semibold text-cyan-400 hover:underline">
                  Entre na sua conta
                </Link>{' '}
                para publicar e interagir.
              </p>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card >
            <h4 className="mb-3 text-sm font-bold text-slate-200">Tags em alta</h4>
            {trendingTags?.length ? (
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {tag} ({count})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Nenhuma tag ainda.</p>
            )}
          </Card>

          <Card >
            <h4 className="mb-3 text-sm font-bold text-slate-200">Estudantes ativos</h4>
            {suggestedUsers?.length ? (
              <ul className="space-y-3">
                {suggestedUsers.map((suggested) => (
                  <li key={suggested.id} className="flex items-center gap-3">
                    <Avatar src={suggested.avatarUrl} alt={suggested.username ?? ''} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/perfil/${suggested.username}`}
                        className="block truncate text-sm font-semibold text-white hover:underline"
                      >
                        {suggested.fullName}
                      </Link>
                      <p className="truncate text-xs text-slate-500">
                        @{suggested.username} · {suggested.followerCount} seguidores
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Nenhuma sugestão no momento.</p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}
