import { Ban } from 'lucide-react'

export default function NoAccess() {
  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center justify-center space-y-4 text-center">
        <Ban className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          No saunas or invites
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Get in touch with your BRF admin for an invite
        </p>
      </div>
  )
}

