export interface Certificate {
  id: string
  code: string
  issuedAt: string
  course: {
    title: string
    categoryName: string
  }
  user?: {
    id: string
    fullName: string
    email: string
    username: string | null
  }
}

export interface VerifyCertificateResponse {
  certificate: {
    id: string
    code: string
    issuedAt: string
    verifiedAt: string | null
    user: {
      fullName: string
    }
    course: {
      title: string
    }
  }
}

export interface IssueCertificateRequest {
  courseId: string
}

export interface IssueCertificateResponse {
  success: true
  certificate: {
    id: string
    code: string
    issuedAt: string
    courseTitle: string
  }
}

export interface UserCertificatesResponse {
  success: true
  certificates: Certificate[]
}