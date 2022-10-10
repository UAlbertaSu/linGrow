import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import useToken from './useToken.js';

function App() {
  const { token, setToken } = useToken();

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
