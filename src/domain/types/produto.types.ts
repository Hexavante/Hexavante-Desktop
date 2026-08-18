export interface Produto {
  id: number
  nome: string
  descricao?: string
  preco: number
  categoria?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface ProdutoFilters {
  search?: string
  categoria?: string
  ativo?: boolean
  page?: number
  limit?: number
}
