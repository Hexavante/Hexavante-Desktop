export interface Pedido {
  id: number
  clienteId: number
  clienteNome?: string
  status: PedidoStatus
  total: number
  itens: PedidoItem[]
  createdAt: string
  updatedAt: string
}

export interface PedidoItem {
  id: number
  produtoId: number
  produtoNome?: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export type PedidoStatus = 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado'

export interface PedidoFilters {
  search?: string
  status?: PedidoStatus
  page?: number
  limit?: number
}
