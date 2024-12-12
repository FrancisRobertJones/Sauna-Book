import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 mx-auto w-full",
        "sm:p-4 md:p-6",
        // Improved max-width scaling
        "max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl",
        className
      )}
      classNames={{
        months: cn(
          "flex flex-col space-y-4",
          // Improved multi-month layout
          "sm:flex-row sm:space-x-4 sm:space-y-0",
          // Center months on larger screens
          "lg:justify-center"
        ),
        month: cn(
          "space-y-4",
          "w-full sm:w-auto",
          // Flexible month sizing
          "lg:min-w-[320px] xl:min-w-[380px]"
        ),
        caption: cn(
          "flex justify-center pt-1 relative items-center",
          "mb-2 md:mb-4"
        ),
        caption_label: cn(
          "text-sm font-medium",
          "md:text-base lg:text-lg"
        ),
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "md:h-8 md:w-8 lg:h-9 lg:w-9"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between",
        head_cell: cn(
          "text-muted-foreground rounded-md font-normal text-[0.8rem]",
          "w-9 sm:w-10 md:w-12 lg:w-14",
          "md:text-sm lg:text-base"
        ),
        row: "flex w-full mt-2 justify-between",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          "sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12",
          "text-sm md:text-base lg:text-lg"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />,
        IconRight: () => <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }