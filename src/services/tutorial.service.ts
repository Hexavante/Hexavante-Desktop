import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type { PaginatedResponse } from '@/domain/types/api.types'
import type {
  TutorialDetail,
  TutorialListItem,
  TutorialQueryParams,
} from '@/domain/types/tutorial.types'

export const tutorialService = {
  async list(params?: TutorialQueryParams): Promise<PaginatedResponse<TutorialListItem>> {
    const { data } = await api.get<PaginatedResponse<TutorialListItem>>(
      ENDPOINTS.TUTORIALS.LIST,
      { params },
    )
    return data
  },

  async getById(id: string): Promise<TutorialDetail> {
    const { data } = await api.get<{ tutorial: TutorialDetail }>(
      ENDPOINTS.TUTORIALS.DETAIL(id),
    )
    return data.tutorial
  },

  // Fire-and-forget: registra visualização sem quebrar a página em caso de erro.
  async registerView(id: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.TUTORIALS.VIEW(id))
    } catch {
      // silencioso — view é métrica, não deve gerar toast/erro
    }
  },
}
