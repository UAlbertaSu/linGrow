import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import DashboardWrapper from '../Dashboard/DashboardWrapper';
import Signup from '../Signup/Signup';
import Welcome from '../Welcome/Welcome';
import Activities from '../Activities/Activities';
import UserInfoParent from '../UserInfo/UserInfoParent';
import UserInfoTeacher from '../UserInfo/UserInfoTeacher';
import UserInfoResearcher from '../UserInfo/UserInfoResearcher';
import UserInfoAdmin from '../UserInfo/UserInfoAdmin';
import GroupManagerWrapper from '../GroupManager/GroupManagerWrapper';
import GroupCreatorWrapper from '../GroupManager/GroupCreatorWrapper';
import GroupDetail from '../GroupManager/GroupDetail';
import AdminAddUser from '../Signup/AdminAddUser';
import UserManagerWrapper from '../UserManager/UserManagerWrapper';

function App() {
  if (localStorage.getItem('lang') === null) {
    return <Welcome />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}></Route>
          <Route path="/dashboard" element={<DashboardWrapper/ >}></Route>
          <Route path="/welcome" element={<Welcome/ >}></Route>
          <Route path="/userinfoparent" element={<UserInfoParent/ >}></Route>
          <Route path="/userinfoteacher" element={<UserInfoTeacher/ >}></Route>
          <Route path="/userinforesearcher" element={<UserInfoResearcher/ >}></Route>
          <Route path="/userinfoadmin" element={<UserInfoAdmin/ >}></Route>
          <Route path="/groupmanager" element={<GroupManagerWrapper/ >}></Route>
          <Route path="/usermanager" element={<UserManagerWrapper/ >}></Route>
          <Route path="/groupcreator" element={<GroupCreatorWrapper/ >}></Route>
          <Route path="/adminadduser" element={<AdminAddUser/ >}></Route>
          <Route path="/groupdetail" element={<GroupDetail/ >}></Route>
          <Route path="/login" element={<Login/ >}></Route>
          <Route path="/signup" element={<Signup/ >}></Route>
          <Route path="/activities" element={<Activities/ >}></Route>
          <Route path="/chat"></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
