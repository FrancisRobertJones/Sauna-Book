import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { format } from 'date-fns';
import { WaitlistModalProps } from '@/types/BookingTypes';

export function WaitlistModal({ slot, onJoinWaitlist, children }: WaitlistModalProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleJoinWaitlist = async () => {
        await onJoinWaitlist(slot);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button 
                        variant="outline" 
                        className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                    >
                        {format(new Date(slot.startTime), 'HH:mm')}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join Waitlist</DialogTitle>
                    <DialogDescription>
                        Would you like to join the waitlist for {format(new Date(slot.startTime), 'HH:mm')}? 
                        We'll notify you if this slot becomes available.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleJoinWaitlist}>
                        Join Waitlist
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}