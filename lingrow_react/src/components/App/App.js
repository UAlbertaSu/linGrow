import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import DashboardParent from '../Dashboard/DashboardParent';
import DashboardTeacher from '../Dashboard/DashboardTeacher';
import DashboardResearcher from '../Dashboard/DashboardResearcher';
import DashboardAdmin from '../Dashboard/DashboardAdmin';
import Signup from '../Signup/Signup';
import Welcome from '../Welcome/Welcome';
import Activities from '../Activities/Activities';

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
          <Route path="/dashboardparent" element={<DashboardParent/ >}></Route>
          <Route path="/dashboardteacher" element={<DashboardTeacher/ >}></Route>
          <Route path="/dashboardresearcher" element={<DashboardResearcher/ >}></Route>
          <Route path="/dashboardadmin" element={<DashboardAdmin/ >}></Route>
          <Route path="/welcome" element={<Welcome/ >}></Route>
          <Route path="/login" element={<Login/ >}></Route>
          <Route path="/signup" element={<Signup/ >}></Route>
          <Route path="/activities" element={<Activities/ >}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
