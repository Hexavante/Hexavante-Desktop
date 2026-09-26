import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { useStartAttempt, useSubmitAttempt } from '@/api/exams/queries'
import { AppError } from '@/adapters/error/app-error'
import type { StartAttemptResponse, SubmitAnswer } from '@/domain/types/exam.types'
import { Clock3, AlertCircle, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight, Crown } from 'lucide-react'
import { toast } from 'sonner'

interface LocationState {
  attempt?: StartAttemptResponse
}

export default function SimuladoFazerPage() {
  const { slug, attemptId } = useParams<{ slug: string; attemptId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const stateAttempt = (location.state as LocationState | null)?.attempt

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [premiumBlocked, setPremiumBlocked] = useState(false)

  // Questions vêm do start (o detalhe NÃO traz questions).
  const [attempt, setAttempt] = useState<StartAttemptResponse | null>(stateAttempt ?? null)
  const startAttempt = useStartAttempt()
  const submitAttempt = useSubmitAttempt()
  const startInitiated = useRef(false)

  // Sem attempt no router state (reload / link direto): refaz o start.
  // A API reaproveita a tentativa em andamento, então é seguro chamar de novo.
  useEffect(() => {
    if (attempt || startInitiated.current || !slug) return
    startInitiated.current = true
    startAttempt.mutate(slug, {
      onSuccess: (data) => {
        setAttempt(data)
        if (data.attemptId !== attemptId) {
          navigate(`/simulados/${slug}/fazer/${data.attemptId}`, {
            replace: true,
            state: { attempt: data },
          })
        }
      },
      onError: (err) => {
        if (err instanceof AppError && err.status === 403) {
          setPremiumBlocked(true)
        }
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const questions = attempt?.questions ?? []
  const totalQuestions = questions.length
  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === totalQuestions - 1

  // Timer a partir do timeLimit do start
  useEffect(() => {
    if (attempt?.timeLimit) {
      setTimeLeft(attempt.timeLimit * 60)
    }
  }, [attempt])

  const handleSubmitRef = useRef<() => void>(() => {})

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft !== null])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (isSubmitting || !attempt) return
    setIsSubmitting(true)
    setShowSubmitConfirm(false)

    try {
      const payloadAnswers: SubmitAnswer[] = (
        Object.entries(answers).map(([questionId, value]): SubmitAnswer | null => {
          if (!value) return null
          const question = questions.find((q) => q.id === questionId)
          if (question?.type === 'ESSAY') {
            return { questionId, essayAnswer: value }
          }
          return { questionId, alternativeId: value }
        })
      ).filter((a): a is SubmitAnswer => a !== null)

      const result = await submitAttempt.mutateAsync({
        attemptId: attempt.attemptId,
        answers: payloadAnswers,
      })
      navigate(`/simulados/${slug}/resultado/${result.attemptId}`, {
        state: { result, examTitle: attempt.title, examSlug: slug },
      })
    } catch (error) {
      if (error instanceof AppError && error.status === 403) {
        toast.error('Conteúdo Premium — ative o trial na loja')
        setPremiumBlocked(true)
      }
      setIsSubmitting(false)
    }
  }

  handleSubmitRef.current = () => {
    if (!isSubmitting) {
      void handleSubmit()
    }
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestion(index)
    }
  }

  const answeredCount = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  if (premiumBlocked) {
    return (
      <div className="hx-page max-w-3xl mx-auto">
        <PageHeader title="Conteúdo Premium" />
        <EmptyState
          icon={<Crown className="h-10 w-10 text-amber-400" />}
          title="Conteúdo Premium — ative o trial na loja"
          description="Este simulado é exclusivo para assinantes."
          action={{ label: 'Ir para a loja', onClick: () => navigate('/loja') }}
        />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate(`/simulados/${slug}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao simulado
          </Button>
        </div>
      </div>
    )
  }

  if (startAttempt.isPending || (!attempt && !startAttempt.isError)) return <LoadingScreen />

  if (!attempt) {
    return (
      <div className="hx-page max-w-3xl mx-auto text-center">
        <PageHeader title="Erro" />
        <Card className="p-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold text-foreground mb-2">Erro ao iniciar simulado</h3>
          <p className="text-sm text-muted-foreground mb-4">Não foi possível iniciar a tentativa. Tente novamente.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate(`/simulados/${slug}`)}>Voltar</Button>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="hx-page max-w-3xl mx-auto text-center">
        <PageHeader title="Erro" />
        <Card className="p-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold text-foreground mb-2">Erro ao carregar simulado</h3>
          <p className="text-sm text-muted-foreground mb-4">Não foi possível carregar as questões. Tente iniciar novamente.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate(`/simulados/${slug}`)}>Voltar</Button>
            <Button onClick={() => navigate('/simulados')}>Ver simulados</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="hx-page max-w-4xl mx-auto">
      {/* Timer Header */}
      {timeLeft !== null && (
        <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 transition-colors ${
          timeLeft <= 300 ? 'bg-red-600/90' : 'bg-surface'
        } border-b border-border`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 className={`h-5 w-5 ${timeLeft <= 300 ? 'text-red-300 animate-pulse' : 'text-teal-400'}`} />
              <span className="font-mono text-lg font-bold text-foreground">{formatTime(timeLeft)}</span>
              {timeLeft <= 300 && <span className="text-xs text-red-300">Tempo acabando!</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Questão {currentQuestion + 1} de {totalQuestions}</span>
              <div className="w-32 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-16 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <Link to={`/simulados/${slug}`} className="hx-btn-ghost p-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <PageHeader
              title={attempt.title}
              description={`Questão ${currentQuestion + 1} de ${totalQuestions}`}
            />
            <div className="w-10" />
          </div>

          {/* Question Navigation */}
          <div className="mb-4 flex gap-1 overflow-x-auto pb-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-semibold transition ${
                  index === currentQuestion
                    ? 'bg-teal-500 text-white ring-2 ring-teal-500/50'
                    : answers[q.id]
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-surface text-muted-foreground hover:bg-surface'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Current Question */}
          {currentQ && (
            <Card className="mb-6">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wide">
                    Questão {currentQuestion + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">{currentQ.points} pts</span>
                  {currentQ.type === 'ESSAY' && (
                    <span className="text-xs text-amber-400">Dissertativa</span>
                  )}
                </div>

                {currentQ.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={currentQ.imageUrl}
                      alt={`Imagem da questão ${currentQuestion + 1}`}
                      className="w-full max-h-64 object-cover"
                    />
                  </div>
                )}

                <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                  {currentQ.statement}
                </p>

                {currentQ.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    {currentQ.alternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => handleAnswer(currentQ.id, alt.id)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition ${
                          answers[currentQ.id] === alt.id
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-border hover:border-teal-500/30 bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            answers[currentQ.id] === alt.id
                              ? 'border-teal-500 bg-teal-500 text-white'
                              : 'border-border text-muted-foreground'
                          }`}>
                            {answers[currentQ.id] === alt.id && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span className="text-foreground">{alt.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQ.type === 'ESSAY' && (
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="w-full min-h-[150px] p-4 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
                    rows={6}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => goToQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Respondidas: {answeredCount}/{totalQuestions}</span>
              <div className="w-32 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {isLastQuestion ? (
              <Button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar Simulado'}
              </Button>
            ) : (
              <Button onClick={() => goToQuestion(currentQuestion + 1)} disabled={!currentQ}>
                Próxima <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Finalizar simulado?</h3>
              <p className="text-muted-foreground">
                Você respondeu {answeredCount} de {totalQuestions} questões.
                {answeredCount < totalQuestions && (
                  <span className="text-amber-400"> {totalQuestions - answeredCount} não respondida(s).</span>
                )}
                <br />
                Tem certeza que deseja enviar?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={() => void handleSubmit()} disabled={isSubmitting} className="flex-1 bg-red-600 hover:bg-red-700">
                  {isSubmitting ? 'Enviando...' : 'Confirmar Envio'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
