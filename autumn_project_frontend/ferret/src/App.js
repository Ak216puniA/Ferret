import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import './App.css';
import Home from './pages/home';
import LoginScreen from './pages/login_screen';

function App() {
  const isAuthenticated = useSelector((state) => state.logout.authenticated)
  return (
    <div className="App">
      <Routes>
        {/* <Route path='/'>{isAuthenticated ? <Navigate to="/home" /> : <LoginScreen />}</Route> */}
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginScreen />} />
      </Routes>  
    </div>
  );
}

export default App;
