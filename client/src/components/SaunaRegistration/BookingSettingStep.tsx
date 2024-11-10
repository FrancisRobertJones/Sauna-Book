import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { SaunaFormValues } from '@/types/FormValues'
import { Label } from '@radix-ui/react-label'
import { UseFormReturn } from 'react-hook-form'


interface BookingSettingsStepProps {
    form: UseFormReturn<SaunaFormValues>
}

export function BookingSettingsStep({ form }: BookingSettingsStepProps) {
    return (
        <>
          <FormField
            control={form.control}
            name="slotDurationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slot Duration (minutes)</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Slider
                      min={30}
                      max={180}
                      step={30}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-grow"
                    />
                    <span className="w-12 text-right">{field.value} min</span>
                  </div>
                </FormControl>
                <FormDescription>Set the duration of each booking slot (30-180 minutes)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxConcurrentBookings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Concurrent Bookings</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormDescription>Set the maximum number of concurrent bookings allowed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )
}