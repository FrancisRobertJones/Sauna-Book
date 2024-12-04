import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { LoadingAnimation } from '@/components/Loading/Loading';
import { useUser } from '@/state/userContext';


export default function MyAdminSaunas() {
    const [loading, setLoading] = useState(true);
    const { state } = useUser()

    useEffect(() => {
        setLoading(false)
        console.log(state.adminSaunas)
    }, [state.adminSaunas]);

    if (loading) {
        return (
            <LoadingAnimation
                isLoading={loading}
                text='Loading..' />
        );
    }


    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Saunas</h1>
                <Link to="/register-sauna">
                    <Button>+ Add New Sauna</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.adminSaunas.map((sauna) => (
                    <Link to={`/admin/sauna/${sauna._id}`} key={sauna._id}>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{sauna.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Location: {sauna.location || 'Not specified'}
                                    </p>
                                    <div className="flex justify-between text-sm">
                                        <span>Slot Duration: {sauna.slotDurationMinutes}min</span>
                                        <span>Max concurrent bookings: {sauna.maxConcurrentBookings}</span>
                                        <span>Max total bookings: {sauna.maxConcurrentBookings}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link to={`/admin/sauna/${sauna._id}`}>
                                    <Button variant="outline">Manage</Button>
                                </Link>
                                <Link to={`/booking/${sauna._id}`}>
                                    <Button>Book</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}

                {state.adminSaunas.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-muted rounded-lg">
                        <h3 className="text-lg font-medium mb-2">No Saunas Yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by adding your first sauna
                        </p>
                        <Link to="/register-sauna">
                            <Button>Register a Sauna</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}