export interface Cliente {
  id: number
  nome: string
  email: string
  telefone?: string
  documento?: string
  createdAt: string
  updatedAt: string
}

export interface ClienteFilters {
  search?: string
  page?: number
  limit?: number
}
