import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useExamDetail, useStartAttempt, useSubmitAttempt } from '@/api/exams/queries'
import { useAuth } from '@/app/hooks/use-auth'
import { Clock3, AlertCircle, CheckCircle, XCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

interface Question {
  id: string
  statement: string
  imageUrl: string | null
  imageDisplaySize: string | null
  orderNumber: number
  points: number
  type: 'MULTIPLE_CHOICE' | 'ESSAY'
  alternatives: Alternative[]
}

interface Alternative {
  id: string
  text: string
  isCorrect?: boolean
}

interface ExamState {
  attemptId: string
  exam: {
    id: string
    title: string
    slug: string
    timeLimit: number | null
    questions: Question[]
  }
}

export default function SimuladoFazerPage() {
  const { slug, attemptId } = useParams<{ slug: string; attemptId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const { data: examData, isLoading: examLoading } = useExamDetail(slug || '')
  const startAttempt = useStartAttempt()
  const submitAttempt = useSubmitAttempt()

  const questions = examData?.questions || []
  const totalQuestions = questions.length
  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === totalQuestions - 1

  // Initialize attempt if needed
  useEffect(() => {
    if (!attemptId && !startAttempt.isPending) {
      startAttempt.mutate(slug!, {
        onSuccess: (data) => {
          navigate(`/simulados/${slug}/fazer/${data.attemptId}`)
        },
      })
    }
  }, [attemptId, slug, navigate, startAttempt])

  // Initialize timeLeft from exam timeLimit
  useEffect(() => {
    if (examData?.timeLimit) {
      setTimeLeft(examData.timeLimit * 60)
    }
  }, [examData])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleTimeUp = () => {
    if (!isSubmitting) {
      handleSubmit()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setShowSubmitConfirm(false)

    try {
      const result = await submitAttempt.mutateAsync({
        slug: slug!,
        attemptId: attemptId!,
        answers: { answers },
      })
      navigate(`/simulados/${slug}/resultado/${result.attemptId}`)
    } catch (error) {
      setIsSubmitting(false)
    }
  }

const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestion(index)
    }
  }

  const answeredCount = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  if (examLoading || startAttempt.isPending) return <LoadingScreen />

  if (!examData || questions.length === 0) {
    return (
      <div className="hx-page max-w-3xl mx-auto text-center">
        <PageHeader title="Erro" />
        <Card className="p-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold text-white mb-2">Erro ao carregar simulado</h3>
          <Button onClick={() => navigate('/simulados')}>Voltar</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="hx-page max-w-4xl mx-auto">
      {/* Timer Header */}
      {timeLeft !== null && (
        <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 transition-colors ${
          timeLeft <= 300 ? 'bg-red-600/90' : 'bg-slate-900/95'
        } border-b border-white/10`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 className={`h-5 w-5 ${timeLeft <= 300 ? 'text-red-300 animate-pulse' : 'text-teal-400'}`} />
              <span className="font-mono text-lg font-bold text-white">{formatTime(timeLeft)}</span>
              {timeLeft <= 300 && <span className="text-xs text-red-300">Tempo acabando!</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Questão {currentQuestion + 1} de {totalQuestions}</span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
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
              title={examData.title}
              description={`Questão ${currentQuestion + 1} de ${totalQuestions}`}
            />
            <div className="w-10" />
          </div>

          {/* Question Navigation */}
          <div className="mb-4 flex gap-1 overflow-x-auto pb-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-semibold transition ${
                  index === currentQuestion
                    ? 'bg-teal-500 text-white ring-2 ring-teal-500/50'
                    : answers[questions[index].id]
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
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
                  <span className="text-xs text-slate-500">{currentQ.points} pts</span>
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

                <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
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
                            : 'border-white/10 hover:border-teal-500/30 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            answers[currentQ.id] === alt.id
                              ? 'border-teal-500 bg-teal-500 text-white'
                              : 'border-white/20 text-slate-400'
                          }`}>
                            {answers[currentQ.id] === alt.id && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span className="text-white">{alt.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQ.type === 'ESSAY' && (
                  <textarea
                    value={(answers[currentQ.id] as string) || ''}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="w-full min-h-[150px] p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
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

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Respondidas: {answeredCount}/{totalQuestions}</span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
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
              <h3 className="text-lg font-bold text-white">Finalizar simulado?</h3>
              <p className="text-slate-400">
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
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-red-600 hover:bg-red-700">
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