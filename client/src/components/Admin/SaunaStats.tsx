import { toast } from "@/hooks/use-toast";
import { Booking } from "@/types/BookingTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "../Loading/Loading";
import { GlowCard } from "../ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "../ui/card";

interface SaunaStats {
    totalBookings: number;
    activeUsers: number;
    todayBookings: number;
}

export function SaunaStatsCard({ saunaId }: { saunaId: string }) {
    const [stats, setStats] = useState<SaunaStats>({ totalBookings: 0, activeUsers: 0, todayBookings: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchAndProcessStats = async () => {
            try {
                const token = await getAccessTokenSilently();
                console.log('Token received and starts with:', token.substring(0, 20) + '...');
                console.log('Fetching stats for saunaId:', saunaId);
                const response = await fetch(
                    `http://localhost:5001/api/adminbooking/sauna/${saunaId}/all-bookings`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (!response.ok) throw new Error('Failed to fetch bookings');
                const bookings: Booking[] = await response.json();
                console.log(bookings)

                const totalBookings = bookings.length;

                const activeUsers = new Set(
                    bookings
                        .filter(booking => booking.status === 'active')
                        .map(booking => booking.userId)
                ).size;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayBookings = bookings.filter(booking => {
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

        fetchAndProcessStats();
    }, [saunaId, getAccessTokenSilently]);

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