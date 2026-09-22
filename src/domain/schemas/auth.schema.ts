import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Informe o e-mail' })
    .min(1, 'Informe o e-mail')
    .email('E-mail inválido')
    .transform((v) => v.trim().toLowerCase()),
  password: z.string({ required_error: 'Informe a senha' }).min(1, 'Informe a senha'),
})

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Informe o nome de usuário' })
    .min(3, 'Mínimo de 3 caracteres')
    .max(30, 'Máximo de 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e underscore'),
  fullName: z.string({ required_error: 'Informe o nome' }).min(2, 'Mínimo de 2 caracteres'),
  email: z
    .string({ required_error: 'Informe o e-mail' })
    .min(1, 'Informe o e-mail')
    .email('E-mail inválido')
    .transform((v) => v.trim().toLowerCase()),
  password: z.string({ required_error: 'Informe a senha' }).min(8, 'Mínimo de 8 caracteres'),
  confirmPassword: z.string({ required_error: 'Confirme a senha' }).min(1, 'Confirme a senha'),
  birthDate: z.string({ required_error: 'Informe a data de nascimento' }).min(1, 'Informe a data de nascimento'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
