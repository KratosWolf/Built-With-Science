import { z } from 'zod';

// Schema para validação de usuário
export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  institution: z.string().min(2, 'Instituição é obrigatória').max(200),
  field: z.string().min(2, 'Campo de pesquisa é obrigatório').max(100),
  role: z.enum(['researcher', 'student', 'educator', 'enthusiast']),
});

// Schema para artigos científicos
export const articleSchema = z.object({
  title: z.string().min(10, 'Título deve ter pelo menos 10 caracteres').max(200),
  abstract: z.string().min(50, 'Resumo deve ter pelo menos 50 caracteres').max(2000),
  authors: z.array(z.string()).min(1, 'Pelo menos um autor é necessário'),
  field: z.string().min(2, 'Campo de pesquisa é obrigatório'),
  tags: z.array(z.string()).max(10, 'Máximo 10 tags permitidas'),
  content: z.string().optional(),
});

// Schema para projetos de pesquisa
export const researchProjectSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(150),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(1000),
  status: z.enum(['planning', 'active', 'completed', 'paused']),
  expectedCompletion: z.string().datetime('Data inválida'),
  maxParticipants: z.number().min(1).max(100).optional(),
});

// Schema para formulário de contato
export const contactSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório').max(100),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres').max(200),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
});

// Schema para busca
export const searchSchema = z.object({
  query: z.string().min(1, 'Termo de busca é obrigatório').max(100),
  field: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'citations']).optional(),
  limit: z.number().min(1).max(50).optional(),
});

// Types derivados dos schemas
export type User = z.infer<typeof userSchema>;
export type Article = z.infer<typeof articleSchema>;
export type ResearchProject = z.infer<typeof researchProjectSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
