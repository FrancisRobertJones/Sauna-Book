import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
      <DialogContent className="sm:max-w-[425px] bg-black text-white border border-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Delete Sauna</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertTriangle className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Are you sure?</h3>
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-medium mb-4 text-center border-y border-white py-2">
            Warning: This action cannot be undone.
          </p>
          <p className="mb-2 text-center">
            You are about to delete the sauna &quot;{saunaName}&quot;. This will:
          </p>
          <ul className="list-none mt-2 space-y-2 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Remove all sauna settings and information
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Cancel all future bookings
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Remove access for all users
            </li>
          </ul>
        </div>
        <DialogFooter className="bg-white px-6 py-4 rounded-b-lg">
          <Button variant="outline" onClick={onClose} className="bg-white text-black border-black hover:bg-gray-200">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="bg-black text-white hover:bg-gray-800">
            Delete Sauna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

