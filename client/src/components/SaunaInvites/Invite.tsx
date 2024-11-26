"use client"

import React, { useState } from 'react'
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
      const response = await fetch('http://localhost:5001/api/invite', {
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to create invite: ${JSON.stringify(errorData)}`)
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
        description: "Failed to create invite. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Create an invite</CardTitle>
        <CardDescription>Enter an email address to send an invitation.</CardDescription>
        <CardDescription className='text-bold '>Please ensure your new user checks spam.</CardDescription>

      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll send an invitation to this email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
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

