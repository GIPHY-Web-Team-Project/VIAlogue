import LandingPage from './views/LandingPage/main/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './store/app-context';
import './App.css';
import Header from './components/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <AppContext.Provider value={AppContext}>
        <div className='font-medium flex flex-col w-screen h-screen bg-white text-black'>
          <Header />
          <Routes>
            <Route path='/' element={<LandingPage />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
