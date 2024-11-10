'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth0 } from '@auth0/auth0-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { BasicInfoStep } from './BasicInfoStep'
import { BookingSettingsStep } from './BookingSettingStep'
import { OperatingHoursStep } from './OperatingHoursStep'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { saunaFormSchema, SaunaFormValues } from '@/types/FormValues'

export default function SaunaRegistrationForm() {
  const [step, setStep] = useState(0)
  const { getAccessTokenSilently } = useAuth0()
  const { toast } = useToast()

  const form = useForm<SaunaFormValues>({
    resolver: zodResolver(saunaFormSchema),
    defaultValues: {
      name: '',
      slotDurationMinutes: 60,
      operatingHours: {
        weekday: { start: '09:00', end: '17:00' },
        weekend: { start: '10:00', end: '16:00' },
      },
      maxConcurrentBookings: 1,
      location: '',
      description: '',
    },
  })

  const onSubmit = async (data: SaunaFormValues) => {
    console.log(data)
/*     try {
      const token = await getAccessTokenSilently()
      const response = await fetch('http://localhost:5001/api/saunas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Sauna registered successfully!',
        })
      } else {
        throw new Error('Failed to register sauna')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register sauna. Please try again.',
        variant: 'destructive',
      })
    } */
  }

  const steps = [
    { title: 'Basic Info', component: BasicInfoStep },
    { title: 'Booking Settings', component: BookingSettingsStep },
    { title: 'Operating Hours', component: OperatingHoursStep },
  ]

  const CurrentStep = steps[step].component

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[step].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={(step + 1) / steps.length * 100} className="mb-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CurrentStep form={form} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}