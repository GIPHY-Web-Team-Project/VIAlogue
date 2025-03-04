import { createContext } from 'react';

export const ChatContext = createContext({
  chats: null,
  setChats: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
});