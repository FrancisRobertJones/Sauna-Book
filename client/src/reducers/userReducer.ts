import { ISauna } from '@/types/SaunaTypes';
import { User as Auth0User } from '@auth0/auth0-react';
export interface UserStatus {
  hasPendingInvites: boolean;
  isSaunaMember: boolean;
}

export interface UserResponse {
  auth0User?: Auth0User;
  role: 'admin' | 'user';
  adminSaunas?: ISauna[];
  accessibleSaunas?: ISauna[];
  status: UserStatus;
}

export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REFRESH_SAUNAS = 'REFRESH_SAUNAS',
  UPDATE_STATUS = 'UPDATE_STATUS',
  UPDATE_ADMIN_SAUNAS = 'UPDATE_ADMIN_SAUNAS'
}

export interface IUserAction {
  type: UserActionType;
  payload?: {
    auth0User?: Auth0User;
    role?: 'admin' | 'user';
    adminSaunas?: ISauna[];
    accessibleSaunas?: ISauna[];
    status?: {
      hasPendingInvites: boolean;
      isSaunaMember: boolean;
    };
  };
}

export class UserState {
  constructor(
    public isAuthenticated: boolean = false,
    public user: AppUser | null = null,
    public role: 'admin' | 'user' | null = null,
    public adminSaunas: ISauna[] = [],
    public accessibleSaunas: ISauna[] = [],
    public status: UserStatus = { hasPendingInvites: false, isSaunaMember: false }
  ) { }
}
export interface AppUser {
  auth0Id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

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
      const role: 'admin' | 'user' = action.payload.role ?? 'user';
      return new UserState(
        true,
        action.payload.auth0User ? mapAuth0UserToAppUser(action.payload.auth0User, role) : null,
        role,
        action.payload.adminSaunas || [],
        action.payload.accessibleSaunas || [],
        {
          hasPendingInvites: action.payload.status?.hasPendingInvites || false,
          isSaunaMember: action.payload.status?.isSaunaMember || false
        }
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

    case UserActionType.UPDATE_ADMIN_SAUNAS:
      if (!action.payload?.adminSaunas) return state;
      return new UserState(
        state.isAuthenticated,
        state.user,
        state.role,
        action.payload.adminSaunas,
        state.accessibleSaunas,
        state.status,
      );

    case UserActionType.LOGOUT:
      return new UserState();

    default:
      return state;
  }
};