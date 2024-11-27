import { Card, CardProps } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function GlowCard({ className, ...props }: CardProps) {
  return (
    <Card
      className={cn(
        'animate-subtle-glow',
        className
      )}
      {...props}
    />
  )
}

