import './App.css';
import Header from './components/Header';
import InPageNavigationBar from './components/InPageNavigationBar';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <div className="App">
      <Header />
      <NavigationBar />
      <InPageNavigationBar current_page='Home'/>
    </div>
  );
}

export default App;
