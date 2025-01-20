'use client'

import React, { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { ieltsRegistrationAction } from '@/lib/actions'
import { Check } from 'lucide-react'
import { useRouter } from "next/navigation"

export function IeltsRegistrationForm({ className }: React.ComponentProps<typeof Card>) {
  const initialState = {
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      country: '',
      learningGoal: '',
    },
    success: false,
    errors: null,
  }

  const router = useRouter();
  const [state, formAction] = useFormState(ieltsRegistrationAction, initialState);
  const { pending } = useFormStatus();

  useEffect(()=>{
    if (state.success) {
      // redirect to exam page
      router.replace('/exam');
    }
  }, [state])

  return (
    <Card className={cn('w-full max-w-md text-start', className)}>
      <CardHeader>
        <CardTitle>Let&apos;s Get to Know You</CardTitle>
        <CardDescription>
          Tell us about yourself to personalize your IELTS online test experience.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-6">
          
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.name}
          >
            <Label
              htmlFor="name"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              First Name <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.name}
              aria-errormessage="error-name"
              defaultValue={state.defaultValues.name}
            />
            {state.errors?.name && (
              <p id="error-name" className="text-destructive text-sm">
                {state.errors.name}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.surname}
          >
            <Label
              htmlFor="surname"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Surname <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="surname"
              name="surname"
              placeholder="Doe"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.surname}
              aria-errormessage="error-surname"
              defaultValue={state.defaultValues.surname}
            />
            {state.errors?.surname && (
              <p id="error-surname" className="text-destructive text-sm">
                {state.errors.surname}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.email}
          >
            <Label
              htmlFor="email"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Email <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.email}
              aria-errormessage="error-email"
              defaultValue={state.defaultValues.email}
            />
            {state.errors?.email && (
              <p id="error-email" className="text-destructive text-sm">
                {state.errors.email}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.country}
          >
            <Label
              htmlFor="country"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Country <span aria-hidden="true">*</span>
            </Label>
            <Select name="country" defaultValue={state.defaultValues.country}>
              <SelectTrigger
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                disabled={pending}
              >
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.country && (
              <p id="error-country" className="text-destructive text-sm">
                {state.errors.country}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.learningGoal}
          >
            <Label
              htmlFor="learningGoal"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Learning Goal <span aria-hidden="true">*</span>
            </Label>
            <Select name="learningGoal" defaultValue={state.defaultValues.learningGoal}>
              <SelectTrigger
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                disabled={pending}
              >
                <SelectValue placeholder="Select your learning goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic Study</SelectItem>
                <SelectItem value="work">Work Abroad</SelectItem>
                <SelectItem value="immigration">Immigration</SelectItem>
                <SelectItem value="personal">Personal Development</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.learningGoal && (
              <p id="error-learningGoal" className="text-destructive text-sm">
                {state.errors.learningGoal}
              </p>
            )}
          </div>


        </CardContent>
        <CardFooter>
          {!state.success &&
          
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
          </Button>
      }

          {state.success ? (
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Your registration has been submitted. Thank you!
            </p>
          ) : null}
        </CardFooter>
      </form>
    </Card>
  )
}

