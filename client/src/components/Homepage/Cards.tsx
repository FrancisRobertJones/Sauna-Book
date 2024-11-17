import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";


export const FeatureCard = ({ 
    icon: Icon, 
    title, 
    description 
  }: { 
    icon: LucideIcon;
    title: string;
    description: string;
  }) => (
    <Card className="bg-background/50 backdrop-blur-lg border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader>
        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )

  export const StepCard = ({ 
    step, 
    title, 
    description 
  }: { 
    step: string | number;
    title: string;
    description: string;
  }) => (
    <Card className="bg-background/50 backdrop-blur-lg border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary/10 p-2 w-8 h-8 flex items-center justify-center">
            <span className="text-primary font-bold">{step}</span>
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
  