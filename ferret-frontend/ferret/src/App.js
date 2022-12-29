import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import LoginScreen from './pages/login_screen';
import SeasonDashboard from './pages/seasonDashboard';
import Questions from './pages/questions'
import LoggingUser from './pages/logging_user';
import InterviewPanel from './pages/interview_panel';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginScreen />} />
        <Route path='/logging' element={<LoggingUser />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/season/:season_id' element={<SeasonDashboard />} />
        <Route path='/season/:season_id/:round_id/questions' element={<Questions />} />
        <Route path='/season/:season_id/interview_panels' element={<InterviewPanel />} />
      </Routes>  
    </div>
  );
}

export default App;
