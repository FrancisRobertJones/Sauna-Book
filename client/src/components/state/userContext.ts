import { createContext, Dispatch, useContext } from 'react';
import { UserState, IUserAction } from '../reducers/userReducer';

interface IUserContext {
  state: UserState;
  dispatch: Dispatch<IUserAction>;
}

const defaultState = new UserState();

export const UserContext = createContext<IUserContext>({
  state: defaultState,
  dispatch: () => null 
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};