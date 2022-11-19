import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Signup from '../Signup/Signup';
import Welcome from '../Welcome/Welcome';
import Activities from '../Activities/Activities';
import GroupManager from '../GroupManager/GroupManager';
import UserInfo from '../UserInfo/UserInfo';

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
          <Route path="/groupmanager" element={<GroupManager/ >}></Route>
          <Route path="/userinfo" element={<UserInfo/ >}></Route>
          <Route path="/login" element={<Login/ >}></Route>
          <Route path="/signup" element={<Signup/ >}></Route>
          <Route path="/activities" element={<Activities/ >}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
