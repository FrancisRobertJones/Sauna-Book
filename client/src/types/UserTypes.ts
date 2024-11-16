import { User as Auth0User } from "@auth0/auth0-react";

export interface Sauna {
    _id: string;
    name: string;
    adminId: string;
  }

  export interface AppUser {  
    auth0Id: string;
    email: string;
    name: string;
  }

  export interface UserResponse {
    auth0User?: Auth0User;  
    adminSaunas?: Sauna[];
    accessibleSaunas?: Sauna[];
  }
  