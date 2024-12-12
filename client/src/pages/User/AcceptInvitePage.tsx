import { Button } from '@/components/ui/button'
import { useAuth0 } from '@auth0/auth0-react';
import { ChevronRight } from 'lucide-react'


const AcceptInvitePage = () => {
    const { loginWithRedirect } = useAuth0()

    const handleUserLogin = () => {
        localStorage.setItem('register_intent', 'user');
    
        loginWithRedirect({
          authorizationParams: {
            redirect_uri: `${window.location.origin}/callback`,
          },
        });
      };
      

    return (
        <div className="relative z-10">
            <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
                        <div className="relative z-10 mx-auto tracking-tight max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
                            <h1 className="text-4xl font-bold sm:text-6xl">
                                Welcome to Book a Bastu
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground">
                                Sign in / sign up to access your personal invitation. <br/>Please use the same email that your invite was sent to.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Button onClick={handleUserLogin} size="lg">
                                    Accept invititation
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AcceptInvitePage