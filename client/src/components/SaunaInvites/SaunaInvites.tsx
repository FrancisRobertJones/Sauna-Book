import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSaunaInvites, Invite } from '../../hooks/use-fetch-sauna-invites'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useWithdrawInvite } from '@/hooks/use-withdraw-invite'

interface SaunaUsersProps {
  saunaId: string;
}

export function SaunaUserInvites({ saunaId }: SaunaUsersProps) {
  const { invites, isLoading, error } = useSaunaInvites(saunaId)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { withdrawInvite, isWithdrawing } = useWithdrawInvite(() => {
    window.location.reload();
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error fetching sauna users: {error.message}</div>
  }

  const totalPages = Math.ceil(invites.length / itemsPerPage)
  const paginatedData = invites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card className="w-full mt-12">
      <CardHeader>
        <CardTitle>Sauna Users</CardTitle>
        <CardDescription>Users invited to this sauna</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Withdraw invitation</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((invite: Invite) => (
              <TableRow key={invite._id}>
                <TableCell>{invite.email}</TableCell>
                <TableCell>{invite.status}</TableCell>
                <TableCell>{new Date(invite.expiresAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {invite.status === 'pending' && (
                    <button
                      onClick={() => withdrawInvite(invite._id)}
                      disabled={isWithdrawing}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                </TableCell>              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

