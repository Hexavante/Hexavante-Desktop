import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  documento: z.string().optional()
})

export type ClienteFormData = z.infer<typeof clienteSchema>
