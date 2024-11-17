import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight, Mail, Bell, Clock, Users, BarChart, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FeatureCard, StepCard } from '@/components/Homepage/Cards';
import { Testimonial } from '@/components/Homepage/Testimonials';



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

const handleNormalLogin = () => {
  localStorage.removeItem('register_intent'); 
  loginWithRedirect({
    authorizationParams: {
      redirect_uri: `${window.location.origin}/callback`
    }
  });
};

const handleRegisterSauna = () => {
  localStorage.setItem('register_intent', 'true');
  loginWithRedirect({
    authorizationParams: {
      redirect_uri: `${window.location.origin}/callback`
    }
  });
};

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-foreground/[0.02] bg-[size:60px_60px]" />
        <div
          className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-muted/20 shadow-xl shadow-primary/10 ring-1 ring-primary/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"
          aria-hidden="true"
        />
        <div className="absolute left-1/2 top-0 h-[1026px] w-[1026px] -translate-x-1/3 stroke-muted-foreground/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0">
          <svg
            viewBox="0 0 1026 1026"
            fill="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full animate-spin-slow"
          >
            <path
              d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
              stroke="currentColor"
              strokeOpacity="0.7"
            />
            <path
              d="M513 1025C230.23 1025 1 795.77 1 513"
              stroke="url(#:R65m:-gradient-1)"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id=":R65m:-gradient-1"
                x1="1"
                y1="513"
                x2="1"
                y2="1025"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
              <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  Revolutionize Your Sauna Management
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Modernize your sauna bookings with our cutting-edge digital platform. Streamline operations, enhance user experience, and boost your business.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button onClick={handleNormalLogin} size="lg">
                    Book a Sauna
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={handleRegisterSauna} size="lg" variant="outline">
                    Register Your Sauna
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-32">
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
                  icon={Clock}
                  title="Real-time Availability"
                  description="View and manage sauna availability in real-time, ensuring efficient scheduling and maximizing occupancy."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={CheckCircle}
                  title="Easy Booking System"
                  description="Streamlined booking process for users, with intuitive interface and instant confirmation."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={Users}
                  title="Digital Access Management"
                  description="Control and monitor sauna access digitally, enhancing security and user convenience."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={Mail}
                  title="Email Reminders"
                  description="Make sure you never miss your sauna time again, we have customisable reminders so we'll email you just when the time is right."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={Bell}
                  title="Instant Notifications"
                  description="Automated alerts for bookings, cancellations, and important updates for both users and admins."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={BarChart}
                  title="Waiting List System"
                  description="Efficiently manage high-demand periods with an automated waiting list, maximizing occupancy."
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 sm:py-32 bg-muted/50">
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="users">For Users</TabsTrigger>
                  <TabsTrigger value="admins">For Admins</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                      step="1"
                      title="Browse"
                      description="Explore available saunas, check real-time availability, and compare options."
                    />
                    <StepCard
                      step="2"
                      title="Book"
                      description="Select your preferred time slot and complete the booking with our easy-to-use system."
                    />
                    <StepCard
                      step="3"
                      title="Enjoy"
                      description="Receive digital access and enjoy your sauna session with peace of mind."
                    />
                  </div>
                </TabsContent>
                <TabsContent value="admins" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                      step="1"
                      title="Register"
                      description="Sign up your sauna on our platform and set up your profile with ease."
                    />
                    <StepCard
                      step="2"
                      title="Manage"
                      description="Control bookings, monitor usage, and adjust settings through our intuitive dashboard."
                    />
                    <StepCard
                      step="3"
                      title="Grow"
                      description="Increase visibility, attract more customers, and optimize your sauna business."
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
              <Card className="bg-background/50 backdrop-blur-lg border-border shadow-lg">
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
                      <span>Real-time availability and instant confirmation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      <span>Digital access for a seamless experience</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <p className="text-2xl font-bold">500+ Happy Users</p>
                </CardFooter>
              </Card>
              <Card className="bg-background/50 backdrop-blur-lg border-border shadow-lg">
                <CardHeader>
                  <CardTitle>For Sauna Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      <span>Streamlined management and booking system</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      <span>Increased visibility and customer reach</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      <span>Detailed analytics and reporting tools</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <p className="text-2xl font-bold">30% Increase in Bookings</p>
                </CardFooter>
              </Card>
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
                avatar="/avatars/alex.jpg"
              />
              <Testimonial
                name="Sarah Lee"
                role="Sauna Owner"
                quote="This platform has revolutionized how I manage my sauna business. Highly recommended!"
                avatar="/avatars/sarah.jpg"
              />
              <Testimonial
                name="Mike Brown"
                role="Fitness Center Manager"
                quote="The analytics tools have helped us optimize our sauna usage and increase revenue."
                avatar="/avatars/mike.jpg"
              />
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-32">
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
                  <AccordionTrigger>How do I book a sauna?</AccordionTrigger>
                  <AccordionContent>
                    Booking a sauna is easy! Simply create an account, browse available saunas, select your preferred time slot, and confirm your booking. You'll receive instant confirmation and digital access instructions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I cancel or reschedule my booking?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel or reschedule your booking up to 24 hours before your scheduled time. Simply log into your account and manage your bookings in the user dashboard.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I register my sauna on the platform?</AccordionTrigger>
                  <AccordionContent>
                    To register your sauna, click on the "Register Your Sauna" button and follow the step-by-step process. You'll need to provide details about your sauna, set up your availability, and complete the verification process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer mobile apps for both iOS and Android devices. You can download them from the App Store or Google Play Store to manage your bookings on the go.
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
              <Button size="lg">
                Get Started Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}