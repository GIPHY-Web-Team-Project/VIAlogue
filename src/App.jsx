import LandingPage from './views/LandingPage/main/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './store/app-context';
import Header from './components/Header/Header';
import Register from './views/Register/Register';
import './App.css';
import Login from './views/Login/Login';
import TeamsTab from './views/TeamsTab/TeamsTab';
import { useState } from 'react';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div className='font-medium flex flex-col w-screen h-screen bg-white text-black'>
          <Header />
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/teams' element={<TeamsTab />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
