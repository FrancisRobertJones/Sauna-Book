import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SaunaFormValues } from '@/types/FormValues'
import { UseFormReturn } from 'react-hook-form'


interface BasicInfoStepProps {
    form: UseFormReturn<SaunaFormValues>
  }

export function BasicInfoStep({ form }:BasicInfoStepProps ) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sauna Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter sauna name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter location" {...field} />
            </FormControl>
            <FormDescription>Provide the address or location of your sauna</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter description" {...field} />
            </FormControl>
            <FormDescription>Provide a brief description of your sauna</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}