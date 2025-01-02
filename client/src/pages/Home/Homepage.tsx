import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight, Mail, Smartphone, Clock, Users, BarChart, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FeatureCard, StepCard } from '@/components/Homepage/Cards';
import { Testimonial } from '@/components/Homepage/Testimonials';
import { GlowCard } from '@/components/ui/GlowCard';
import AuthSection from '@/components/Homepage/RegisterAuth';



export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("users")
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    localStorage.removeItem('register_intent');
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`
      }
    });
  };

  return (

    <main className="relative z-10" role="main">
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36" aria-label="Hero section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            <div className="relative z-10 mx-auto tracking-tight max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              <h1 className="text-4xl font-bold sm:text-6xl">
                Welcome to Sauna Book
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Discover a new way to manage and enjoy saunas. Whether you're a sauna enthusiast or a business owner, we've got you covered.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={handleLogin} size="lg" aria-label="Login for existing users">
                  Existing users
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Revolutionize Your Sauna Management
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Modernize your sauna bookings with our cutting-edge digital platform. Streamline operations, enhance user experience, and boost your business.
        </p>
      </div>
      <AuthSection />

      <section className="py-20 sm:py-32 bg-muted/50" aria-label="How it works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you're a sauna enthusiast or a sauna owner, our platform makes the process simple and efficient.
            </p>
          </div>
          <div className="mt-16">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" aria-label="User type selection">
              <TabsList className="grid w-full grid-cols-2" aria-label="Choose between users and admins">
                <TabsTrigger value="users">For Users</TabsTrigger>
                <TabsTrigger value="admins">For Admins</TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StepCard
                    step="1"
                    title="Browse"
                    description="We give you access to a demo sauna to see how the systems features work on account creation."
                  />
                  <StepCard
                    step="2"
                    title="Book"
                    description="Request your sauna admin to send you an invite to the email you have created your account with."
                  />
                  <StepCard
                    step="3"
                    title="Enjoy"
                    description="Book times, set reminders, join waiting lists and enjoy!"
                  />
                </div>
              </TabsContent>
              <TabsContent value="admins" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StepCard
                    step="1"
                    title="Register"
                    description="Register as an admin and register your first sauna, setting opening hours, max bookings per user, slot length and more!"
                  />
                  <StepCard
                    step="2"
                    title="Manage"
                    description="Start inviting members, and managing users"
                  />
                  <StepCard
                    step="3"
                    title="Follow, grow, adjust"
                    description="As usage grows you can adjust your saunas opening hours, slot lengths, max bookings and see real time stats regarding bookings and active users!"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32" aria-label="Features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful Features for Modern Sauna Management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform offers a comprehensive suite of tools designed to streamline your sauna operations and enhance user experience.
            </p>
          </div>
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={Users}
                title="Instant invite system"
                description="View and manage sauna members with invites and invite withdrawals, allowing access to only the users you want."
                aria-label="Feature: Instant invite system"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={CheckCircle}
                title="Easy Booking System"
                description="Streamlined booking process for users, with intuitive interface and instant confirmation, fully functional and beautiful on mobile screens."
                aria-label="Feature: Easy Booking System"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={Clock}
                title="Waiting lists"
                description="The time you want is booked but you want to be the first to know if it becomes available? We've got you!"
                aria-label="Feature: Waiting lists"

              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={Mail}
                title="Email Reminders"
                description="Make sure you never miss your sauna time again, we have customisable reminders so we'll email you just when the time is right."
                aria-label="Feature: Email Reminders"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={Smartphone}
                title="Mobile friendly"
                description="Booking system and admin system developed with mobile users in mind."
                aria-label="Feature: Mobile friendly"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={BarChart}
                title="Live user statistics"
                description="Efficiently view and manage active users and bookings in our admin interface."
                aria-label="Live user statistics"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Benefits for Everyone
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform offers unique advantages for both sauna users and owners.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
            <GlowCard className="bg-background/50 backdrop-blur-lg border-border shadow-lg">
              <CardHeader>
                <CardTitle>For Sauna Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    <span>Easy online booking and management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    <span>Waiting lists and reminders so you never miss a time!</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    <span>Digital access for a seamless experience</span>
                  </li>
                </ul>
              </CardContent>
            </GlowCard>
            <GlowCard className="bg-background/50 backdrop-blur-lg border-border shadow-lg">
              <CardHeader>
                <CardTitle>For Sauna Owners</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    <span>Easy to use admin interface to manage users, bookings and your saunas details</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    <span>Detailed analytics and reporting tools</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    <span>Easy to use invite system to give access to manage who has access to your saunas booking.</span>
                  </li>
                </ul>
              </CardContent>
            </GlowCard>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don't just take our word for it. Here's what our satisfied users have to say about our platform.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Testimonial
              name="Alex Johnson"
              role="Sauna Enthusiast"
              quote="Booking a sauna has never been easier. I love the real-time availability feature!"
            />
            <Testimonial
              name="Sarah Lee"
              role="Sauna Owner"
              quote="This platform has revolutionized how I manage my sauna business. Highly recommended!"
            />
            <Testimonial
              name="Mike Brown"
              role="Fitness Center Manager"
              quote="The analytics tools have helped us optimize our sauna usage and increase revenue."
            />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32" aria-label="Frequently Asked Questions">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
            </p>
          </div>
          <div className="mt-16 max-w-2xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger aria-label="How do I book a sauna?">How do I book a sauna?</AccordionTrigger>
                <AccordionContent>
                  Booking a sauna is easy! Simply create a user account, browse the demo saunas or get invited to a real sauna, select your preferred time slot, and confirm your booking. You'll receive instant confirmation and digital access instructions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger aria-label="Can I cancel a sauna booking?">Can I cancel or reschedule my booking?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel or reschedule your booking right up to your scheduled time. Simply log into your account and manage your bookings in the user dashboard.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger aria-label="How can I register a sauna as admin?">How do I register my sauna on the platform?</AccordionTrigger>
                <AccordionContent>
                  To register your sauna, first register as an admin, then click on the "Register Your Sauna" button and follow the step-by-step process. You'll need to provide details about your sauna, set up your availability, and complete the verification process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger aria-label="Is there a mobile app?">Is there a mobile app available?</AccordionTrigger>
                <AccordionContent>
                  No, but our website is carefully developed to be fully funcional and beautiful on mobile devices!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Transform Your Sauna Experience?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of satisfied users and sauna owners. Start your journey today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <AuthSection />
          </div>
        </div>
      </section>
    </main>
  )
}