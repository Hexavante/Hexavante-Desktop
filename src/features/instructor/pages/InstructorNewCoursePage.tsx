import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourseCategories } from '@/api/instructor/queries'
import { useCreateCourse } from '@/api/courses/mutations'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CourseLevel, CourseType, ProgressionType } from '@/domain/types/course.types'

export default function InstructorNewCoursePage() {
  const navigate = useNavigate()
  const { data: categories, isLoading } = useCourseCategories()
  const createMutation = useCreateCourse()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState<CourseLevel>('BEGINNER')
  const [courseType, setCourseType] = useState<CourseType>('FREE')
  const [progressionType, setProgressionType] = useState<ProgressionType>('PROGRESSIVE')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  if (isLoading) return <LoadingScreen />

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    )
  }

  const handleSubmit = () => {
    createMutation.mutate(
      {
        title,
        slug,
        categoryId,
        shortDescription,
        description,
        level,
        courseType,
        progressionType,
        ...(estimatedHours ? { estimatedHours: Number(estimatedHours) } : {}),
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
      },
      {
        onSuccess: () => navigate('/instrutor/cursos'),
      },
    )
  }

  const canSubmit =
    title.trim().length >= 3 &&
    slug.trim().length >= 3 &&
    !!categoryId &&
    !createMutation.isPending

  return (
    <div className="hx-page mx-auto max-w-2xl">
      <PageHeader title="Novo curso" description="Preencha as informações básicas do curso.">
        <Button variant="ghost" size="sm" onClick={() => navigate('/instrutor/cursos')}>
          ← Voltar
        </Button>
      </PageHeader>

      <div className="hx-card space-y-4 p-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex.: Introdução à Programação"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Categoria *</Label>
          <select
            id="category"
            className="hx-input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="short">Descrição curta</Label>
          <Input
            id="short"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Resumo em uma frase"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            className="hx-input min-h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="level">Nível</Label>
            <select
              id="level"
              className="hx-input"
              value={level}
              onChange={(e) => setLevel(e.target.value as CourseLevel)}
            >
              <option value="BEGINNER">Iniciante</option>
              <option value="INTERMEDIATE">Intermediário</option>
              <option value="ADVANCED">Avançado</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              className="hx-input"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value as CourseType)}
            >
              <option value="FREE">Gratuito</option>
              <option value="PAID">Pago</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prog">Progressão</Label>
            <select
              id="prog"
              className="hx-input"
              value={progressionType}
              onChange={(e) => setProgressionType(e.target.value as ProgressionType)}
            >
              <option value="FREE">Livre</option>
              <option value="PROGRESSIVE">Sequencial</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="hours">Horas estimadas</Label>
            <Input
              id="hours"
              type="number"
              min={1}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="thumb">URL da capa</Label>
            <Input
              id="thumb"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <Button disabled={!canSubmit} onClick={handleSubmit}>
          {createMutation.isPending ? 'Criando...' : 'Criar curso'}
        </Button>
      </div>
    </div>
  )
}