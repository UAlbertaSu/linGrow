import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';

function App() {
  const [token, setToken] = useState();

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <h1>Applications</h1>
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
