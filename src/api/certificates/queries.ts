import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/keys'
import { certificatesApi } from './api'
import { useAuthStore } from '@/app/stores/auth.store'
import { staleTimes } from '@/app/queries/options'
import { toast } from 'sonner'

export function useUserCertificates() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.certificates.list,
    queryFn: () => certificatesApi.getUserCertificates(),
    enabled: isAuthenticated,
    staleTime: staleTimes.NORMAL,
  })
}

export function useIssueCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => certificatesApi.issueCertificate(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.list })
      toast.success('Certificado emitido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao emitir certificado')
    },
  })
}

export function useVerifyCertificate() {
  return useMutation({
    mutationFn: (code: string) => certificatesApi.verifyCertificate(code),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao verificar certificado')
    },
  })
}