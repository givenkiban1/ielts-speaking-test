import { z } from 'zod'

export const ieltsRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  surname: z
    .string()
    .min(2, { message: 'Surname must be at least 2 characters' })
    .max(50, { message: 'Surname must be at most 50 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  country: z.string().min(1, { message: 'Please select a country' }),
  learningGoal: z.string().min(1, { message: 'Please select a learning goal' }),
})

