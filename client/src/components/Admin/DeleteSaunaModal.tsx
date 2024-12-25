import { Trash2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface DeleteSaunaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  saunaName: string
}

export function DeleteSaunaModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  saunaName 
}: DeleteSaunaModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trash2 className="w-6 h-6" />
            Delete Sauna
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">Warning</p>
          </div>
          <p className="mb-4">
            You are about to delete the sauna &quot;{saunaName}&quot;.
          </p>
          <p className="font-medium mb-2">This will:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Remove all sauna settings and information</li>
            <li>Cancel all future bookings</li>
            <li>Remove access for all users</li>
          </ul>
        </div>
        <Separator className="my-4" />
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            onClick={onClose} 
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            className="w-full sm:w-auto hover:bg-gray-800"
          >
            Delete Sauna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

