import { User as Auth0User } from '@auth0/auth0-react';
import { Sauna } from "@/pages/Booking";

export interface UserStatus {
  hasPendingInvites: boolean;
  isSaunaMember: boolean;
}

export interface UserResponse {
  auth0User?: Auth0User; 
  role: 'admin' | 'user';
  adminSaunas?: Sauna[];
  accessibleSaunas?: Sauna[];
  status: UserStatus;
}

export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REFRESH_SAUNAS = 'REFRESH_SAUNAS',
  UPDATE_STATUS = 'UPDATE_STATUS'
}

export interface IUserAction {
  type: UserActionType;
  payload?: UserResponse;
}

export class UserState {
  constructor(
    public isAuthenticated: boolean = false,
    public user: AppUser | null = null,
    public role: 'admin' | 'user' | null = null,
    public adminSaunas: Sauna[] = [],
    public accessibleSaunas: Sauna[] = [],
    public status: UserStatus = {
      hasPendingInvites: false,
      isSaunaMember: false
    }
  ) {}
}

export interface AppUser {
  auth0Id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Keep your existing mapAuth0UserToAppUser and userReducer implementations
const mapAuth0UserToAppUser = (auth0User: Auth0User, role: 'admin' | 'user'): AppUser => ({
  auth0Id: auth0User.sub!,
  email: auth0User.email!,
  name: auth0User.name!,
  role: role
});

export const userReducer = (state: UserState, action: IUserAction): UserState => {
  switch (action.type) {
    case UserActionType.LOGIN:
      if (!action.payload) return state;
      return new UserState(
        true,
        action.payload.auth0User ? mapAuth0UserToAppUser(action.payload.auth0User, action.payload.role) : null,
        action.payload.role,
        action.payload.adminSaunas || [],
        action.payload.accessibleSaunas || [],
        action.payload.status
      );
      
    case UserActionType.REFRESH_SAUNAS:
      if (!action.payload) return state;
      return new UserState(
        state.isAuthenticated,
        state.user,
        state.role,
        action.payload.adminSaunas || [],
        action.payload.accessibleSaunas || [],
        state.status
      );

    case UserActionType.UPDATE_STATUS:
      if (!action.payload?.status) return state;
      return new UserState(
        state.isAuthenticated,
        state.user,
        state.role,
        state.adminSaunas,
        state.accessibleSaunas,
        action.payload.status
      );

    case UserActionType.LOGOUT:
      return new UserState();

    default:
      return state;
  }
};