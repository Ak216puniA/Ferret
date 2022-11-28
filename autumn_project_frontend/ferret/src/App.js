import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import LoginScreen from './pages/login_screen';
import SeasonDashboard from './pages/seasonDashboard';
import Root from './pages/root';
import LoggingUser from './pages/logging_user';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path='/' element={<Root />} /> */}
        <Route path='/' element={<LoginScreen />} />
        <Route path='/logging' element={<LoggingUser />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/season/:season_id' element={<SeasonDashboard />} />
      </Routes>  
    </div>
  );
}

export default App;
