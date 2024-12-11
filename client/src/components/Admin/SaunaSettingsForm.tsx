import { useToast } from "@/hooks/use-toast";
import { saunaFormSchema, SaunaFormValues } from "@/types/FormValues";
import { ISauna } from "@/types/SaunaTypes";
import { useAuth0 } from "@auth0/auth0-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form } from "@/components/ui/form";
import { BasicInfoStep } from "../SaunaRegistration/BasicInfoStep";
import { BookingSettingsStep } from "../SaunaRegistration/BookingSettingStep";
import { OperatingHoursStep } from "../SaunaRegistration/OperatingHoursStep";
import { SaunaSummaryModal } from "./SaunaSummaryModal";
import { LoadingAnimation } from "../Loading/Loading";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DeleteSaunaModal } from "./DeleteSaunaModal";
import { apiUrl } from "@/constants/api-url";

export default function SaunaSettingsForm({ saunaId }: { saunaId: string }) {
    const [showSummary, setShowSummary] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { getAccessTokenSilently } = useAuth0();
    const { toast } = useToast();
    const [sauna, setSauna] = useState<ISauna | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const form = useForm<SaunaFormValues>({
        resolver: zodResolver(saunaFormSchema),
    });

    const { reset } = form;

    useEffect(() => {
        const fetchSauna = async () => {
            try {
                setIsLoading(true);
                const token = await getAccessTokenSilently();
                const response = await fetch(
                    `${apiUrl}/api/saunas/${saunaId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch sauna details');
                }

                const data = await response.json();
                setSauna(data);

                reset({
                    name: data.name || '',
                    slotDurationMinutes: data.slotDurationMinutes || 60,
                    operatingHours: data.operatingHours || {
                        weekday: { start: '09:00', end: '17:00' },
                        weekend: { start: '10:00', end: '16:00' },
                    },
                    maxConcurrentBookings: data.maxConcurrentBookings || 1,
                    maxTotalBookings: data.maxTotalBookings || 5,
                    location: data.location || '',
                    description: data.description || '',
                });
            } catch (error) {
                console.error('Error fetching sauna:', error);
                toast({
                    title: "Error",
                    description: "Failed to load sauna details. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (saunaId) {
            fetchSauna();
        }
    }, [saunaId, getAccessTokenSilently, reset]);

    const handleDeleteSauna = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(
                `${apiUrl}/api/adminbooking/sauna/${sauna?._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete sauna');
            }

            toast({
                title: 'Success',
                description: 'Sauna has been successfully deleted.',
            });

            navigate('/dashboard');

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete sauna. Please try again.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return <LoadingAnimation isLoading={isLoading} text="Loading sauna details..." />;
    }

    if (!sauna) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-6 text-center">
                    <p className="text-lg text-muted-foreground">
                        Could not find the requested sauna.
                    </p>
                </Card>
            </div>
        );
    }

    const handleSubmit = (data: SaunaFormValues) => {
        setShowSummary(true);
    };

    const handleConfirmSubmit = async () => {
        const data = form.getValues();
        setShowSummary(false);

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(
                `${apiUrl}/api/adminbooking/sauna/${sauna?._id}/settings`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update sauna settings');
            }

            toast({
                title: 'Success',
                description: 'Sauna settings updated successfully!',
            });

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update sauna settings. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Update Sauna Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <BasicInfoStep form={form} />
                        <BookingSettingsStep form={form} />
                        <OperatingHoursStep form={form} />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button 
                    type="button" 
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Delete Sauna
                </Button>
                <Button 
                    type="button" 
                    onClick={form.handleSubmit(handleSubmit)}
                >
                    Review Changes
                </Button>
            </CardFooter>

            <SaunaSummaryModal
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                onConfirm={handleConfirmSubmit}
                data={form.getValues()}
            />

            {sauna && (
                <DeleteSaunaModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteSauna}
                    saunaName={sauna.name}
                />
            )}
        </Card>
    );
}