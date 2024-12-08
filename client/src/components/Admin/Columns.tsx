import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Booking } from "@/types/BookingTypes"

const isInPast = (date: Date): boolean => {
  return date.getTime() < new Date().getTime()
}

const getBookingStatus = (
  currentStatus: Booking['status'], 
  endTime: Date
): Booking['status'] => {
  if (currentStatus === 'cancelled' || currentStatus === 'early_completion') {
    return currentStatus
  }
  
  if (isInPast(endTime) && currentStatus === 'active') {
    return 'completed'
  }
  
  return currentStatus
}

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "startTime",
    header: "Date",
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime"))
      return startTime.toLocaleDateString()
    },
  },
  {
    id: "timeRange",
    header: "Time",
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime"))
      const endTime = new Date(row.original.endTime)
      
      const startTimeString = !isNaN(startTime.getTime())
        ? startTime.toLocaleTimeString()
        : 'Invalid Time'
      const endTimeString = !isNaN(endTime.getTime())
        ? endTime.toLocaleTimeString()
        : 'Invalid Time'
        
      return `${startTimeString} - ${endTimeString}`
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const endTime = new Date(row.original.endTime)
      const currentStatus = row.getValue("status") as Booking['status']
      const status = getBookingStatus(currentStatus, endTime)

      return (
        <Badge variant={getStatusVariant(status)}>{status}</Badge>
      )
    },
  },
]

function getStatusVariant(status: Booking['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'active':
      return 'default'
    case 'completed':
      return 'secondary'
    case 'cancelled':
      return 'destructive'
    case 'early_completion':
      return 'outline'
    default:
      return 'default'
  }
}