import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CreateInviteForm from '@/components/SaunaInvites/Invite';
import { SaunaUserInvites } from '@/components/SaunaInvites/SaunaInvites';
import { SaunaUserManagement } from '@/components/Admin/SaunaUserManagement';
import { SaunaStatsCard } from '../../components/Admin/SaunaStats';
import SaunaSettingsForm from '../../components/Admin/SaunaSettingsForm';
import { useEffect, useState } from 'react';
import { Booking } from '@/types/BookingTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { AdminBookingsForm } from '@/components/Admin/AdminBookingsForm';
import { apiUrl } from '@/constants/api-url';
import { LoadingAnimation } from '@/components/Loading/Loading';

const SaunaAdminDashboard = () => {
    const { saunaId } = useParams<{ saunaId: string }>();
    const [allBookings, setAllBookings] = useState<Booking[]>();
    const { getAccessTokenSilently } = useAuth0();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const token = await getAccessTokenSilently();
                const response = await fetch(
                    `${apiUrl}/api/adminbooking/sauna/${saunaId}/all-bookings`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (!response.ok) throw new Error('Failed to fetch bookings');
                const bookings: Booking[] = await response.json();
                if (bookings) setAllBookings(bookings);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [saunaId]);

    if (isLoading) {
        return <LoadingAnimation
            isLoading={isLoading}
            text="Loading sauna stats"
        />;
    }


    return (
        <div className="container mx-auto py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Sauna Dashboard</h1>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="w-full flex-wrap justify-start overflow-x-auto">
                    <TabsTrigger value="overview" className="px-1 sm:px-3 md:px-4">Overview</TabsTrigger>
                    <TabsTrigger value="invite" className="px-2 sm:px-4 md:px-6">Invites</TabsTrigger>
                    <TabsTrigger value="users" className="px-2 sm:px-4 md:px-6">Users</TabsTrigger>
                    <TabsTrigger value="bookings" className="px-2 sm:px-4 md:px-6">Bookings</TabsTrigger>
                    <TabsTrigger value="settings" className="px-2 sm:px-4 md:px-6">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Sauna Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {allBookings &&
                                <SaunaStatsCard
                                    allBookings={allBookings}
                                />
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="invite">
                    {saunaId &&
                        <>
                            <CreateInviteForm saunaId={saunaId} />
                            <SaunaUserInvites saunaId={saunaId} />
                        </>
                    }
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SaunaUserManagement />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Sauna settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {saunaId &&
                                <SaunaSettingsForm saunaId={saunaId} />
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="bookings">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allBookings &&
                                <AdminBookingsForm
                                    allBookings={allBookings}
                                    setAllBookings={setAllBookings}
                                />
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default SaunaAdminDashboard