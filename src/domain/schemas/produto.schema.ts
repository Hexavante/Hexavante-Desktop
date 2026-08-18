import { z } from 'zod'

export const produtolSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  preco: z.coerce.number().positive('Preço deve ser positivo'),
  categoria: z.string().optional(),
  ativo: z.boolean().default(true)
})

export type ProdutoFormData = z.infer<typeof produtolSchema>
