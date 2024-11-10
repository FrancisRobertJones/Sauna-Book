// src/types/sauna.ts
import { z } from "zod"

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const saunaFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slotDurationMinutes: z.number().min(30).max(180),
  operatingHours: z.object({
    weekday: z.object({
      start: z.string().regex(timeRegex, 'Invalid time format'),
      end: z.string().regex(timeRegex, 'Invalid time format'),
    }),
    weekend: z.object({
      start: z.string().regex(timeRegex, 'Invalid time format'),
      end: z.string().regex(timeRegex, 'Invalid time format'),
    }),
  }),
  maxConcurrentBookings: z.number().min(1),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type SaunaFormValues = z.infer<typeof saunaFormSchema>