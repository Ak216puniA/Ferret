import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import './App.css';
import Home from './pages/home';
import LoginScreen from './pages/login_screen';
import SeasonDashboard from './pages/seasonDashboard';

function App() {
  const isAuthenticated = useSelector((state) => state.logout.authenticated)
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/season/:season_id' element={<SeasonDashboard />} />
      </Routes>  
    </div>
  );
}

export default App;
