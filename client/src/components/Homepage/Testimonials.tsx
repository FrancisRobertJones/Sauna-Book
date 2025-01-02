import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlowCard } from "../ui/GlowCard";

export const Testimonial = ({ 
    name, 
    role, 
    quote, 
  }: { 
    name: string;
    role: string;
    quote: string;
  }) => (
    <GlowCard className="bg-background/50 backdrop-blur-lg border-border shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground italic">"{quote}"</p>
      </CardContent>
    </GlowCard>
  )