"use client"

import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { apiUrl } from '@/constants/api-url'

interface CreateInviteFormProps {
  saunaId: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function CreateInviteForm({ saunaId }: CreateInviteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { getAccessTokenSilently } = useAuth0()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${apiUrl}/api/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: values.email,
          saunaId
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 400 && data.message?.includes('already has access')) {
          toast({
            title: "Already a member",
            description: data.message || "This user already has access to the sauna",
            variant: "destructive"
          })
          form.reset()
          return
        }
        throw new Error(data.message || 'Failed to create invite')
      }

      toast({
        title: "Invite Created",
        description: `An invite has been sent to ${values.email}`,
      })
      form.reset()
    } catch (error) {
      console.error('Error creating invite:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invite. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Create an invite</CardTitle>
        <CardDescription>Enter an email address to send an invitation.</CardDescription>
        <CardDescription className="font-medium text-amber-600">Please ensure your new user checks spam.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormDescription className="text-sm">
                    We'll send an invitation to this email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="px-4 sm:px-6">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Create Invite"}
        </Button>
      </CardFooter>
    </Card>
  )
}

