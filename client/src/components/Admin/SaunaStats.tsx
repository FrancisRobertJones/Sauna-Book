import { toast } from "@/hooks/use-toast";
import { Booking } from "@/types/BookingTypes";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "../Loading/Loading";
import { GlowCard } from "../ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "../ui/card";

interface SaunaStats {
    totalBookings: number;
    activeUsers: number;
    todayBookings: number;
}

export function SaunaStatsCard({ allBookings }: {allBookings: Booking[]}) {
    const [stats, setStats] = useState<SaunaStats>({ totalBookings: 0, activeUsers: 0, todayBookings: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const processStats = async () => {
            if (!allBookings) return;
            try {
                const activeBookings: Booking[] = allBookings.filter(booking => booking.status === 'active');

                const totalBookings = activeBookings.length;

                const activeUsers = new Set(
                    activeBookings.map(booking => booking.userId)
                ).size;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayBookings = activeBookings.filter(booking => {
                    const bookingDate = new Date(booking.startTime);
                    bookingDate.setHours(0, 0, 0, 0);
                    return bookingDate.getTime() === today.getTime();
                }).length;

                setStats({
                    totalBookings,
                    activeUsers,
                    todayBookings
                });
            } catch (error) {
                console.error('Error fetching sauna stats:', error);
                toast({
                    title: "Error",
                    description: "Failed to load sauna statistics.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        processStats();
    }, [allBookings]);

    if (isLoading) {
        return <LoadingAnimation isLoading={isLoading} text="Loading sauna statistics..." />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                </CardContent>
            </GlowCard>
            <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                </CardContent>
            </GlowCard>
            <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.todayBookings}</div>
                </CardContent>
            </GlowCard>
        </div>
    );
}