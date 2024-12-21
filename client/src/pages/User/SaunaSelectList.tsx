import { useEffect, useState } from "react"
import { SaunaCard } from "../../components/Bookings/SaunaCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/state/userContext"
import { GlowCard } from "@/components/ui/GlowCard"

export default function SaunaSelectBooking() {
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useUser();

  useEffect(() => {
    if (state.accessibleSaunas !== undefined) {
      setIsLoading(false);
    }
  }, [state.accessibleSaunas]);

  const SkeletonCards = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <GlowCard key={i} className="p-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </GlowCard>
      ))}
    </>
  );

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonCards />;
    }

    if (!Array.isArray(state.accessibleSaunas)) {
      return <p className="col-span-full text-center">Error loading saunas. Please try again.</p>;
    }

    if (state.accessibleSaunas.length === 0) {
      return (
        <GlowCard className="col-span-full p-6">
          <p className="text-center text-muted-foreground">No saunas are currently available.</p>
        </GlowCard>
      );
    }

    return state.accessibleSaunas.map((sauna) => (
      <SaunaCard key={sauna._id} sauna={sauna} />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Available Saunas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderContent()}
      </div>
    </div>
  );
}