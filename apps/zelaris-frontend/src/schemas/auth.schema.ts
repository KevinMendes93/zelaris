import { z } from 'zod';

export const loginSchema = z.object({
    cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    cpf: z.string().min(1, 'CPF é obrigatório').max(11, 'CPF deve ter no máximo 11 dígitos'),
    email: z.email('Email inválido').min(1, 'Email é obrigatório'),
    telefone: z.string().max(11, 'Telefone inválido').optional(),
    senha: z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
        .regex(/[^a-zA-Z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
});

export const forgotPasswordSchema = z.object({
    email: z.email('Email inválido'),
});

export const resetPasswordSchema = z.object({
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
