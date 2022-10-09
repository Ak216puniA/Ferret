import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/pages/home';
import LoginScreen from './components/pages/login_screen';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginScreen />} />
      </Routes>  
    </div>
  );
}

export default App;
