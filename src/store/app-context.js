import { createContext } from 'react';

export const AppContext = createContext({
  user: null,
  userData: null,
  setAppState: () => {},
  selectedChat: null,
  setSelectedChat: () => {}
});
