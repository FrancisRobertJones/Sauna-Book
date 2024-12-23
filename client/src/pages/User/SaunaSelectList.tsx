import { SaunaCard } from "@/components/Bookings/SaunaCard";
import { LoadingAnimation } from "@/components/Loading/Loading";
import { GlowCard } from "@/components/ui/GlowCard";
import { useUser } from "@/state/userContext";
import { useEffect, useState } from "react";

export default function SaunaSelectBooking() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { state } = useUser();

  useEffect(() => {
    const initializeData = async () => {
      if (
        state.isAuthenticated &&
        state.accessibleSaunas !== undefined &&
        state.role === 'user'
      ) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsInitialLoad(false);
      }
    };

    initializeData();
  }, [state.accessibleSaunas, state.isAuthenticated, state.role]);


  if (isInitialLoad || !state.isAuthenticated || state.accessibleSaunas === undefined) {
    return <LoadingAnimation isLoading={true} text="Loading available saunas..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Available Saunas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(state.accessibleSaunas) && state.accessibleSaunas.length > 0 ? (
          state.accessibleSaunas.map((sauna) => (
            <SaunaCard key={sauna._id} sauna={sauna} />
          ))
        ) : (
          <GlowCard className="col-span-full p-6">
            <p className="text-center text-muted-foreground">
              No saunas are currently available.
            </p>
          </GlowCard>
        )}
      </div>
    </div>
  );
}