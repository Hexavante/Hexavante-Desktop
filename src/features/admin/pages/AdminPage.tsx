import { useState } from 'react'
import { usePermissionsList, useRolesList } from '@/api/authorization/queries'
import { useCreatePermission, useCreateRole } from '@/api/authorization/mutations'
import { useAuthorizationContext } from '@/api/authorization/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const permissionSchema = z.object({
  name: z.string().regex(/^[a-z]+\.[a-z]+$/, 'Formato: recurso.acao (ex: course.create)'),
  resource: z.string().min(1, 'Recurso é obrigatório'),
  action: z.string().min(1, 'Ação é obrigatória'),
  description: z.string().optional(),
})

const roleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
})

type PermissionForm = z.infer<typeof permissionSchema>
type RoleForm = z.infer<typeof roleSchema>

function CreatePermissionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const createPermission = useCreatePermission()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PermissionForm>({
    resolver: zodResolver(permissionSchema),
  })

  async function onSubmit(data: PermissionForm) {
    createPermission.mutate(data, {
      onSuccess: () => { onOpenChange(false); reset() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-white">Nova Permissão</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="hx-label">Nome (recurso.acao)</label>
            <input className="hx-input" placeholder="ex: course.create" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="hx-label">Recurso</label>
            <input className="hx-input" placeholder="course" {...register('resource')} />
            {errors.resource && <p className="mt-1 text-xs text-red-400">{errors.resource.message}</p>}
          </div>
          <div>
            <label className="hx-label">Ação</label>
            <input className="hx-input" placeholder="create" {...register('action')} />
            {errors.action && <p className="mt-1 text-xs text-red-400">{errors.action.message}</p>}
          </div>
          <div>
            <label className="hx-label">Descrição (opcional)</label>
            <input className="hx-input" {...register('description')} />
          </div>
          <Button type="submit" disabled={createPermission.isPending} className="w-full">
            {createPermission.isPending ? 'Criando...' : 'Criar Permissão'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CreateRoleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const createRole = useCreateRole()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
  })

  async function onSubmit(data: RoleForm) {
    createRole.mutate(data, {
      onSuccess: () => { onOpenChange(false); reset() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-white">Nova Função</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="hx-label">Nome</label>
            <input className="hx-input" placeholder="ex: MODERATOR" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="hx-label">Descrição (opcional)</label>
            <input className="hx-input" {...register('description')} />
          </div>
          <Button type="submit" disabled={createRole.isPending} className="w-full">
            {createRole.isPending ? 'Criando...' : 'Criar Função'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type Tab = 'permissoes' | 'funcoes'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('permissoes')
  const [showCreatePermission, setShowCreatePermission] = useState(false)
  const [showCreateRole, setShowCreateRole] = useState(false)

  const { data: context, isLoading: contextLoading } = useAuthorizationContext()
  const { data: permissionsData, isLoading: permsLoading } = usePermissionsList()
  const { data: rolesData, isLoading: rolesLoading } = useRolesList()

  const isLoading = contextLoading || permsLoading || rolesLoading

  const isAdmin = context?.roles?.includes('ADMIN') ?? false

  if (isLoading) return <LoadingScreen />

  if (!isAdmin) {
    return (
      <div className="hx-page">
        <PageHeader title="Administração" description="Gerenciamento do sistema" />
        <EmptyState
          title="Acesso restrito"
          description="Você não possui permissão para acessar esta página"
        />
      </div>
    )
  }

  return (
    <div className="hx-page">
      <PageHeader title="Administração" description="Gerencie permissões e funções do sistema">
        {tab === 'permissoes' && (
          <Button size="sm" onClick={() => setShowCreatePermission(true)}>+ Nova Permissão</Button>
        )}
        {tab === 'funcoes' && (
          <Button size="sm" onClick={() => setShowCreateRole(true)}>+ Nova Função</Button>
        )}
      </PageHeader>

      <div className="mb-6 flex gap-1 rounded-lg bg-white/5 p-1">
        <button
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${tab === 'permissoes' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setTab('permissoes')}
        >
          Permissões
        </button>
        <button
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${tab === 'funcoes' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setTab('funcoes')}
        >
          Funções
        </button>
      </div>

      {tab === 'permissoes' && (
        <div className="hx-card overflow-hidden">
          {!permissionsData || permissionsData.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Nenhuma permissão cadastrada</div>
          ) : (
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-[1fr_120px_100px] gap-2 px-4 py-3 text-xs font-semibold text-slate-500">
                <span>Nome</span>
                <span>Recurso</span>
                <span>Ação</span>
              </div>
              {permissionsData.map(p => (
                <div key={p.id} className="grid grid-cols-[1fr_120px_100px] items-center gap-2 px-4 py-3 text-sm">
                  <span className="text-white">{p.name}</span>
                  <span className="text-slate-400">{p.resource}</span>
                  <span><Badge variant="outline" className="text-[10px]">{p.action}</Badge></span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'funcoes' && (
        <div className="space-y-3">
          {!rolesData || rolesData.length === 0 ? (
            <div className="hx-card p-8 text-center text-sm text-slate-400">Nenhuma função cadastrada</div>
          ) : (
            rolesData.map(role => (
              <div key={role.id} className="hx-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{role.name}</h4>
                    {role.description && <p className="text-xs text-slate-400">{role.description}</p>}
                  </div>
                  <Badge variant="outline">{role.permissions?.length ?? 0} permissões</Badge>
                </div>
                {role.permissions && role.permissions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {role.permissions.map(p => (
                      <Badge key={p.id} variant="secondary" className="text-[10px]">{p.name}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <CreatePermissionDialog open={showCreatePermission} onOpenChange={setShowCreatePermission} />
      <CreateRoleDialog open={showCreateRole} onOpenChange={setShowCreateRole} />
    </div>
  )
}
