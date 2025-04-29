import { createContext } from 'react';

export const AppContext = createContext({
  user: null,
  userData: null,
  userLoading: true,
  setAppState: () => {},
  selectedChat: null,
  setSelectedChat: () => {}
});
