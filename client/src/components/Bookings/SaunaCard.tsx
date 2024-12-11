import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ISauna } from "@/types/SaunaTypes"
import { Clock, MapPin, Users } from 'lucide-react'
import { Link } from "react-router-dom"
import { GlowCard } from "../ui/GlowCard"


interface SaunaCardProps {
  sauna: ISauna
}

export function SaunaCard({ sauna }: SaunaCardProps) {
    return (
      <GlowCard className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-[200px] w-full bg-muted">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span className="text-4xl font-bold">{sauna.name[0]}</span>
          </div>
        </div>
        
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span>{sauna.name}</span>
          </CardTitle>
          {sauna.location && (
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {sauna.location}
            </CardDescription>
          )}
        </CardHeader>
  
        <CardContent className="space-y-2">
          {sauna.description && (
            <p className="text-sm text-muted-foreground">{sauna.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {sauna.slotDurationMinutes} mins
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Max {sauna.maxConcurrentBookings} people
            </div>
          </div>
  
          <div className="space-y-1 text-sm">
            <p>
              <strong>Weekdays:</strong> {sauna.operatingHours.weekday.start} -{" "}
              {sauna.operatingHours.weekday.end}
            </p>
            <p>
              <strong>Weekends:</strong> {sauna.operatingHours.weekend.start} -{" "}
              {sauna.operatingHours.weekend.end}
            </p>
          </div>
        </CardContent>
  
        <CardFooter>
          <Link to={`/booking/${sauna._id}`} className="w-full">
            <Button className="w-full">Book Now</Button>
          </Link>
        </CardFooter>
      </GlowCard>
    )
  }

