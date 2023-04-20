import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/index.tsx'
import axios from 'axios';
// axios.defaults.headers.common['Authorization'] = '111';
// 下面应该是对应协议而配置的全局header
// axios.defaults.headers.post['Content-Type'] = 'application/json';
function App() {
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
