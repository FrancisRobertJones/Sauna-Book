import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AuthSection from "@/components/Homepage/RegisterAuth"
import { Link } from 'react-router-dom'

export default function RegisterNewUser() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex mb-8">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>

        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Create Your Account
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you'd like to use SaunaBook. Whether you're looking to book sessions or manage your sauna business, we've got you covered.
          </p>
        </div>
        <AuthSection/>
        <div className="mt-16 text-center">
          <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            If you're having trouble deciding which option is right for you, our support team is here to help.
          </p>
          <Button variant="outline">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}