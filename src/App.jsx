import LandingPage from './views/LandingPage/main/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
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
          <div className='font-medium flex flex-col w-screen h-screen bg-gray-900 text-white'>
            { !user && <Header />}
            <UserStatus /> 
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/teams' element={<TeamsPage />} />
            <Route path='/teams/:teamId' element={<TeamWindow />} />
            <Route path='/profile/:username' element={<Profile />} />
            {/* <Route path="/view-profile/:username" element={<ViewProfile />} /> */}
            <Route path='/chats' element={<ChatPage />} />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}
