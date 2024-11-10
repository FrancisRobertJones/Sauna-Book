import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SaunaFormValues } from '@/types/FormValues'
import { UseFormReturn } from 'react-hook-form'


interface TimeInputProps {
    form: UseFormReturn<SaunaFormValues>;
    name: 'operatingHours.weekday.start' | 'operatingHours.weekday.end' | 
          'operatingHours.weekend.start' | 'operatingHours.weekend.end';
    label: string;
}
  
function TimeInput({ form, name, label }: TimeInputProps) {
  
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

interface StepProps {
    form: UseFormReturn<SaunaFormValues>;
  }
  
  export function OperatingHoursStep({ form }: StepProps) {
    return (
      <div className="space-y-4">
        <FormDescription>
          Set the operating hours for weekdays and weekends
        </FormDescription>
        <div className="grid grid-cols-2 gap-4">
          <TimeInput 
            form={form} 
            name="operatingHours.weekday.start" 
            label="Weekday Start" 
          />
          <TimeInput 
            form={form} 
            name="operatingHours.weekday.end" 
            label="Weekday End" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TimeInput 
            form={form} 
            name="operatingHours.weekend.start" 
            label="Weekend Start" 
          />
          <TimeInput 
            form={form} 
            name="operatingHours.weekend.end" 
            label="Weekend End" 
          />
        </div>
      </div>
    );
  }