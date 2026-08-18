import { api } from '@/http/client'
import { ENDPOINTS } from '@/http/endpoints'
import type {
  Certificate,
  UserCertificatesResponse,
  IssueCertificateResponse,
  VerifyCertificateResponse,
  IssueCertificateRequest,
} from './types'

export const certificatesApi = {
  async getUserCertificates(): Promise<Certificate[]> {
    const { data } = await api.get<UserCertificatesResponse>(ENDPOINTS.CERTIFICATES.LIST)
    return data.certificates
  },

  async issueCertificate(courseId: string): Promise<IssueCertificateResponse> {
    const { data } = await api.post<IssueCertificateResponse>(ENDPOINTS.CERTIFICATES.ISSUE, { courseId })
    return data
  },

  async verifyCertificate(code: string): Promise<VerifyCertificateResponse> {
    const { data } = await api.get<VerifyCertificateResponse>(ENDPOINTS.CERTIFICATES.VERIFY(code))
    return data
  },
}