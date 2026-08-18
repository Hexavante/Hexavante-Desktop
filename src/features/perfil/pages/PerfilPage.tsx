import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile } from '@/api/users/queries'
import { useUpdateProfile } from '@/api/users/mutations'
import { useAuth } from '@/app/hooks/use-auth'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { toast } from 'sonner'

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Mínimo de 2 caracteres'),
  username: z
    .string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(30, 'Máximo de 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e underscore'),
  birthDate: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

export default function PerfilPage() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    values: profile
      ? {
          fullName: profile.fullName,
          username: profile.username,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
        }
      : undefined,
  })

  async function onSubmit(data: ProfileFormData) {
    updateProfile.mutate(
      {
        fullName: data.fullName,
        username: data.username,
        birthDate: data.birthDate || undefined,
      },
      {
        onSuccess: () => {
          setEditing(false)
          toast.success('Perfil atualizado!')
        },
        onError: () => {
          toast.error('Erro ao atualizar perfil')
        },
      }
    )
  }

  if (isLoading) return <LoadingScreen />

  const userProfile = profile

  if (!userProfile) {
    return (
      <div className="hx-page">
        <PageHeader title="Perfil" />
        <p className="text-sm text-slate-400">Erro ao carregar perfil</p>
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais"
      >
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="hx-card flex flex-col items-center p-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-3xl font-black text-cyan-400">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-lg font-bold text-white">{userProfile.fullName}</h2>
            <p className="text-sm text-slate-400">@{userProfile.username}</p>

            <div className="mt-4 flex gap-2">
              {userProfile.isPremium && <Badge><Star className="h-3 w-3" /> Premium</Badge>}
              {userProfile.isVerified && <Badge variant="secondary">✓ Verificado</Badge>}
            </div>

            <div className="mt-6 flex w-full justify-around text-center">
              <div>
                <p className="text-xl font-bold text-white">{userProfile.coins}</p>
                <p className="text-xs text-slate-400">Moedas</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{userProfile.isPremium ? 'Sim' : 'Não'}</p>
                <p className="text-xs text-slate-400">Premium</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="hx-card p-6">
            <h3 className="mb-4 text-sm font-bold text-white">
              {editing ? 'Editar Informações' : 'Informações Pessoais'}
            </h3>

            {editing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="hx-label">Nome completo</label>
                  <input className="hx-input" {...register('fullName')} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="hx-label">Nome de usuário</label>
                  <input className="hx-input" {...register('username')} />
                  {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
                </div>

                <div>
                  <label className="hx-label">Data de nascimento</label>
                  <input className="hx-input" type="date" {...register('birthDate')} />
                  {errors.birthDate && <p className="mt-1 text-xs text-red-400">{errors.birthDate.message}</p>}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setEditing(false); reset() }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm text-white">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Nome de usuário</p>
                    <p className="text-sm text-white">@{userProfile.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Data de nascimento</p>
                    <p className="text-sm text-white">
                      {userProfile.birthDate
                        ? new Date(userProfile.birthDate).toLocaleDateString('pt-BR')
                        : 'Não informada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Membro desde</p>
                    <p className="text-sm text-white">
                      {new Date(userProfile.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                {(userProfile.phone || userProfile.city || userProfile.bio) && (
                  <>
                    <hr className="border-white/5" />
                    {userProfile.phone && (
                      <div>
                        <p className="text-xs text-slate-400">Telefone</p>
                        <p className="text-sm text-white">{userProfile.phone}</p>
                      </div>
                    )}
                    {userProfile.city && userProfile.state && (
                      <div>
                        <p className="text-xs text-slate-400">Localização</p>
                        <p className="text-sm text-white">{userProfile.city}, {userProfile.state}</p>
                      </div>
                    )}
                    {userProfile.bio && (
                      <div>
                        <p className="text-xs text-slate-400">Bio</p>
                        <p className="text-sm text-white">{userProfile.bio}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
