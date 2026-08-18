export interface Configuracao {
  id: number
  chave: string
  valor: string
  tipo: ConfiguracaoTipo
  createdAt: string
  updatedAt: string
}

export type ConfiguracaoTipo = 'string' | 'number' | 'boolean' | 'json'
