import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Signup from '../Signup/Signup';
import Welcome from '../Welcome/Welcome';

function App() {
  if (localStorage.getItem('lang') === null) {
    return <Welcome />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}></Route>
          <Route path="/dashboard" element={<Dashboard/ >}></Route>
          <Route path="/welcome" element={<Welcome/ >}></Route>
          <Route path="/login" element={<Login/ >}></Route>
          <Route path="/signup" element={<Signup/ >}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
