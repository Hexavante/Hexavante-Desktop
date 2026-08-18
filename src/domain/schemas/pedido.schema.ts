import { z } from 'zod'

export const pedidoItemSchema = z.object({
  produtoId: z.number().positive(),
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  precoUnitario: z.number().positive()
})

export const pedidoSchema = z.object({
  clienteId: z.number().positive('Cliente é obrigatório'),
  itens: z.array(pedidoItemSchema).min(1, 'Pelo menos um item é obrigatório')
})

export type PedidoFormData = z.infer<typeof pedidoSchema>
export type PedidoItemFormData = z.infer<typeof pedidoItemSchema>
