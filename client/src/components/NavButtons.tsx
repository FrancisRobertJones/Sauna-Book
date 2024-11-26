import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

export const NavButtons = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="flex gap-4">
            <Button variant={"secondary"}
                onClick={() => {
                    localStorage.removeItem('register_intent');
                    loginWithRedirect({
                        authorizationParams: {
                            redirect_uri: `${window.location.origin}/callback`
                        }
                    });
                }}
            >

                Book a Sauna
            </Button>

            <Button
                variant={"secondary"}
                onClick={() => {
                    localStorage.setItem('register_intent-manage', 'true');
                    loginWithRedirect({
                        authorizationParams: {
                            redirect_uri: `${window.location.origin}/callback`
                        }
                    });
                }}
            >
                Admin login
            </Button>
        </div>
    );
};