import z from 'zod'

export const apiKeyScheme = z
  .string()
  .min(16, 'API key must be at least 16 characters long')
  .max(128, 'API key must not exceed 128 characters')
  .regex(/^\S+$/, 'API key must not contain spaces')

export const commitScheme = z
  .string()
  .trim()
  .min(3)
  .max(255)
  .refine((val) => val.length > 0)
