import LandingPage from './views/LandingPage/main/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './store/app-context';
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import { ChatContext } from './store/chat.context';
import ChatPage from './views/ChatPage/ChatPage';
import ChatWindow from './components/Channels/ChatWindow/ChatWindow';
import EditMessage from './components/Channels/EditMessage/EditMessage';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/user.service';
import './App.css';
import Profile from './views/Profile/Profile';
import TeamsPage from './views/TeamsPage/TeamsPage';
import TeamWindow from './components/Teams/TeamWindow/TeamWindow';

export default function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  const [chatState, setChatState] = useState({
    chats: null,
    setChats: (chats) => setChatState((prevState) => ({ ...prevState, chats })),
    selectedChat: null,
    setSelectedChat: (selectedChat) => setChatState((prevState) => ({ ...prevState, selectedChat })),
  });

  const [user] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({
      ...appState,
      user,
    });
  }

  useEffect(() => {
    if (!user) return;

    getUserData(appState.user.uid)
      .then((data) => {
        const userData = data[Object.keys(data)[0]];
        setAppState({
          ...appState,
          userData,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <ChatContext.Provider value={{ ...chatState, setChatState }}>
          <div className='font-medium flex flex-col w-screen h-screen bg-gray-900 text-white'>
            <Header />
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/teams' element={<TeamsPage />} />
              <Route path='/teams/:teamId' element={<TeamWindow />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/chats' element={<ChatPage />} />
              <Route path='/chats/:chatId' element={<ChatWindow />} />
              <Route path='/chats/:chatId/messages/:messageId/edit' element={<EditMessage />} />
              <Route path='*' element={<h1>404 Not Found</h1>} />
            </Routes>
          </div>
        </ChatContext.Provider>
      </AppContext.Provider>
    </BrowserRouter>
  );
}
