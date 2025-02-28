import LandingPage from './views/LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './store/app-context';
import './App.css';
import Header from './components/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <AppContext.Provider value={AppContext}>
        <Header />
        <Routes>
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;

