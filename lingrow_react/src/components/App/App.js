import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  const token = getToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/ >}></Route>
          <Route path="/preferences" element={<Preferences/ >}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
