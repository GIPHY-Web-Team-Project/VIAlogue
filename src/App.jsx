import LandingPage from './views/LandingPage/main/LandingPage';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AppContext } from './store/app-context';
import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import ChatPage from './views/ChatPage/ChatPage';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/user.service';
import './App.css';
import Profile from './views/Profile/Profile';
import TeamsPage from './views/Teams/TeamsPage/TeamsPage';
import TeamWindow from './views/Teams/TeamWindow/TeamWindow';
import UserStatus from './components/UserStatus/UserStatus';
import Modal from './components/UI/Modal/Modal';

export default function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    userLoading: true,
  });
  const [selectedChat, setSelectedChat] = useState(null);  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [user] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({
      ...appState,
      user,
    });
  }

  useEffect(() => {
    if (!user) { 
      setAppState((prev) => ({ ...prev, userLoading: false }));
      return;
    }

    setAppState((prev) => ({ ...prev, userLoading: true }));

    getUserData(appState.user.uid)
      .then((data) => {
        const userData = data[Object.keys(data)[0]];
        setAppState((prev) => ({
          ...prev,
          userData,
          userLoading: false,
        }));
      })
      .catch((error) => {
        console.log(error);
        setModalMessage(`Something went wrong. Please try again later!`);
        setShowModal(true);
        setAppState((prev) => ({ ...prev, userLoading: false }));
      });
  }, [user]);

  return (
    <HashRouter>
      <AppContext.Provider value={{ ...appState, setAppState, selectedChat, setSelectedChat }}>
        <div className='font-medium flex flex-col w-full h-full min-w-screen min-h-screen overflow-hidden animate-gradient bg-gradient-to-r from-gray-600 to-gray-800 bg-[length:400%_400%] text-white'>
          {!user && <Header />}
          <UserStatus />
          {appState.userLoading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:teamId" element={<TeamWindow />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/chats" element={<ChatPage />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
            )}
          </div>
      </AppContext.Provider>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} message={modalMessage} />}
    </HashRouter>
  );
}
