import { useUser } from '@/state/userContext';
import { Navigate, Outlet } from 'react-router-dom';

export const PendingInvitesGuard = () => {
  const { state } = useUser();
  
  if (state.role === 'user' && state.status.hasPendingInvites) {
    return <Navigate to="/check-invites" replace />;
  }

  return <Outlet />;
};