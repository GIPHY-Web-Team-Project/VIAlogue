import LandingPage from './views/LandingPage/main/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppContext } from './store/app-context';
import Header from './components/Header/Header';
import Register from './views/Register/Register';
import './App.css';
import Login from './views/Login/Login';
import TeamsTab from './views/TeamsTab/TeamsTab';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase-config';
import { getUserData } from './services/user.service';
import Profile from './views/Profile/Profile';

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
          <Header />
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/teams' element={<TeamsTab />} />
            {/* <Route path='/chats' element={<ChatsTab />} /> */}
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}
