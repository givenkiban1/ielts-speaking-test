'use client'

import { ieltsRegistrationSchema } from '@/lib/schema'
import { TestSession } from '@/types'
import { z } from 'zod'

export async function ieltsRegistrationAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = ieltsRegistrationSchema.parse(Object.fromEntries(formData))

    // Store in localStorage
    localStorage.setItem('ielts-registration', JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    }))

    // This simulates a slow response like a form submission.
    // Replace this with your actual form submission logic.
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(data)

    return {
      defaultValues: {
        name: '',
        surname: '',
        email: '',
        country: '',
        learningGoal: '',
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}

// Helper functions to work with localStorage
export function getStoredRegistrationData() {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('ielts-registration');
  return stored ? JSON.parse(stored) : null;
}

export function clearStoredRegistrationData() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('ielts-registration');
}

// Helper function to get the current test session
export function getCurrentTestSession() {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('test-session');
  return stored ? JSON.parse(stored) : null;
}

// Helper function to clear the current test session
export function clearTestSession(testId: string) {
  // Clear the specific test session
  localStorage.removeItem(`test_session_${testId}`);
  
  // Clear all recordings and results for this test
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.includes(`recording_part`) || 
        key?.includes(`_metadata`) || 
        key?.startsWith(`result_${testId}`)) {
      localStorage.removeItem(key);
    }
  }
}

// Helper function to store the current test session
export function storeTestSession(session: TestSession) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('test-session', JSON.stringify(session));
}