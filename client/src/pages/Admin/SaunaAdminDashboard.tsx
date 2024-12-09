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

const SaunaAdminDashboard = () => {
    const { saunaId } = useParams<{ saunaId: string }>();
    const [allBookings, setAllBookings] = useState<Booking[]>();
    const { getAccessTokenSilently } = useAuth0();


    useEffect(() => {
        const fetchBookings = async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(
                `http://localhost:5001/api/adminbooking/sauna/${saunaId}/all-bookings`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const bookings: Booking[] = await response.json();
            if (bookings) setAllBookings(bookings)
        }
        fetchBookings()
    }, [saunaId])


    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Sauna Dashboard</h1>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="invite">Invites</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sauna Overview</CardTitle>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Invite a new user to your sauna</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {saunaId &&
                                <>
                                    <CreateInviteForm saunaId={saunaId} />
                                    <SaunaUserInvites saunaId={saunaId} />
                                </>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SaunaUserManagement />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sauna settings</CardTitle>
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
                            <CardTitle>Bookings</CardTitle>
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