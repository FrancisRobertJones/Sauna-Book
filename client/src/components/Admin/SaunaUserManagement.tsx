import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useFetchSaunaUsersBySauna } from '@/hooks/use-fetch-sauna-users-by-sauna'
import { useRemoveSaunaAccess } from '@/hooks/use-remove-sauna-access'
import { useParams } from 'react-router-dom'
import { SaunaUserStats } from '@/types/UserTypes'
import { LoadingAnimation } from '../Loading/Loading'

export function SaunaUserManagement() {
  const { saunaId } = useParams<{ saunaId: string }>();
  const { users, setUsers, isLoading } = useFetchSaunaUsersBySauna(saunaId as string)
  const { removeAccess, isRemoving, removeError } = useRemoveSaunaAccess(saunaId as string, setUsers)
  const [userToRemove, setUserToRemove] = useState<SaunaUserStats | null>(null)

  const columns: ColumnDef<SaunaUserStats>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setUserToRemove(row.original)}
          disabled={isRemoving}
        >
          Remove Access
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    <LoadingAnimation isLoading={true} text="Loading Users..." />;
  }


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sauna User Management</h2>
      {removeError && <div className="text-red-500 text-center">{removeError}</div>}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToRemove} onOpenChange={() => setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove sauna access for {userToRemove?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToRemove) {
                  removeAccess(userToRemove.userId)
                  setUserToRemove(null)
                }
              }}
            >
              Remove Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

