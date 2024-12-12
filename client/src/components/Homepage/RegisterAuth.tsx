import { useAuth0 } from '@auth0/auth0-react'
import { motion } from 'framer-motion'
import { ChevronRight, Users, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from '../ui/GlowCard'

export default function AuthSection() {
  const { loginWithRedirect } = useAuth0()

  const handleUserLogin = () => {
    localStorage.setItem('register_intent', 'user');

    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
      },
    });
  };
  
  const handleAdminLogin = () => {
    localStorage.setItem('register_intent', 'admin');
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-12 lg:pb-12 xl:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlowCard className="h-full">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Sauna Users</CardTitle>
                <CardDescription>
                  Book and manage your sauna sessions with ease
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                    Easy online booking system
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                    Real-time availability check
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                    Automated reminders
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleUserLogin}
                >
                  Register as a User
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlowCard className="h-full">
              <CardHeader>
                <Building2 className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Sauna Owners</CardTitle>
                <CardDescription>
                  Manage your sauna business efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                    Complete management dashboard
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                    Booking analytics and insights
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                    Customer management tools
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant="outline"
                  onClick={handleAdminLogin}
                >
                  Register as an Admin
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}