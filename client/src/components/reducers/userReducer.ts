import { Sauna } from "@/pages/Booking";
import { AppUser, UserResponse } from "@/types/UserTypes";
import { User as Auth0User } from "@auth0/auth0-react";

export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REFRESH_SAUNAS = 'REFRESH_SAUNAS',
}

export interface IUserAction {
  type: UserActionType;
  payload?: UserResponse;
}

const mapAuth0UserToAppUser = (auth0User: Auth0User): AppUser => ({
    auth0Id: auth0User.sub!,
    email: auth0User.email!,
    name: auth0User.name!
  });
  

export class UserState {
  constructor(
    public isAuthenticated: boolean = false,
    public user: AppUser | null = null,
    public isAdmin: boolean = false,
    public adminSaunas: Sauna[] = [],
    public accessibleSaunas: Sauna[] = []
  ) {}
}


export const userReducer = (state: UserState, action: IUserAction): UserState => {
    switch (action.type) {
      case UserActionType.LOGIN:
        return new UserState(
          true,
          action.payload?.auth0User ? mapAuth0UserToAppUser(action.payload.auth0User) : null,
          (action.payload?.adminSaunas?.length || 0) > 0,
          action.payload?.adminSaunas || [],
          action.payload?.accessibleSaunas || []
        );
  
      case UserActionType.REFRESH_SAUNAS:
        return new UserState(
          state.isAuthenticated,
          state.user,
          (action.payload?.adminSaunas?.length || 0) > 0,
          action.payload?.adminSaunas || [],
          action.payload?.accessibleSaunas || []
        );
  
      case UserActionType.LOGOUT:
        return new UserState();
  
      default:
        return state;
    }
  };