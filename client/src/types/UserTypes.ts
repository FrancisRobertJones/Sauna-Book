import { User as Auth0User } from '@auth0/auth0-react';
import { UserActionType } from "@/reducers/userReducer";
import { Sauna } from './BookingTypes';

export interface UserResponse {
  _id: string;
  auth0Id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  saunaAccess: string[];
  status: {
    hasPendingInvites: boolean;
    isSaunaMember: boolean;
  };
}

export interface AppUser {
  auth0Id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface UserStatus {
  hasPendingInvites: boolean;
  isSaunaMember: boolean;
}

export interface UserState {
  isAuthenticated: boolean;
  user: AppUser | null;
  role: 'admin' | 'user' | null;
  adminSaunas: Sauna[];
  accessibleSaunas: Sauna[];
  status: UserStatus;
}

export interface UserActionPayload {
  auth0User?: Auth0User;
  role: 'admin' | 'user';
  adminSaunas?: Sauna[];
  accessibleSaunas?: Sauna[];
  status: UserStatus;
}

export interface IUserAction {
  type: UserActionType;
  payload?: UserActionPayload;
}

export interface SaunaUserStats {
  userId: string;
  name: string;
  email: string;
  upcomingBookings: number;
  totalBookings: number;
}