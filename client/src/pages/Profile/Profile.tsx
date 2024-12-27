'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useUser } from '@/state/userContext'
import { useUpdateProfile } from '@/hooks/use-update-user'
import { useDeleteAccount } from '@/hooks/use-delete-user'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export default function ProfilePage() {
  const { state } = useUser()
  const { updateProfile, isUpdating, error: updateError } = useUpdateProfile()
  const { deleteAccount, isDeleting, error: deleteError } = useDeleteAccount()

  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: state.user?.name || '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    try {
      await updateProfile(values.name)
      setIsEditing(false)
    } catch (err) {
      setError(updateError || 'Failed to update profile. Please try again.')
    }
  }

  const handleDeleteAccount = async () => {
    setError(null)
    try {
      await deleteAccount()
    } catch (err) {
      setError(deleteError || 'Failed to delete account. Please try again.')
    }
  }

  if (!state.isAuthenticated || !state.user) {
    return <div className="text-center py-8">Please log in to view your profile.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-400" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{state.user.name}</h1>
            <Badge variant="secondary" className="mt-2">
              {state.user.role}
            </Badge>
            <p className="mt-2 text-gray-600">{state.user.email}</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="mt-4 sm:mt-0 sm:ml-auto">
              <Pencil className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    render={() => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input value={state.user!.email} disabled />
                        </FormControl>
                        <FormDescription>Email cannot be changed</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="role"
                    render={() => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input value={state.user!.role} disabled />
                        </FormControl>
                        <FormDescription>Role is assigned by administrators</FormDescription>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Sauna Access</CardTitle>
            <CardDescription>
              {state.role === 'admin' ? 'Saunas you manage' : 'Saunas you have access to'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.status.hasPendingInvites && (
              <Alert className="mb-4">
                <AlertTitle>Pending Invites</AlertTitle>
                <AlertDescription>You have pending invites to join saunas.</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {state.role === 'admin'
                ? state.adminSaunas.map((sauna) => (
                  <Card key={sauna._id}>
                    <CardHeader>
                      <CardTitle>{sauna.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Manage
                      </Button>
                    </CardContent>
                  </Card>
                ))
                : state.accessibleSaunas.map((sauna) => (
                  <Card key={sauna._id}>
                    <CardHeader>
                      <CardTitle>{sauna.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Book
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
            {((state.role === 'admin' && state.adminSaunas.length === 0) ||
              (state.role === 'user' && state.accessibleSaunas.length === 0)) && (
                <div className="text-center py-8 text-gray-500">
                  No saunas available. {state.role === 'user' && "You haven't joined any saunas yet."}
                </div>
              )}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Deleting your account is permanent and cannot be undone. All your data will be lost.
              </AlertDescription>
            </Alert>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-4">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Delete Account'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

