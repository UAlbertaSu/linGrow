import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import DashboardWrapper from '../Dashboard/DashboardWrapper';
import Signup from '../Signup/Signup';
import Welcome from '../Welcome/Welcome';
import Activities from '../Activities/Activities';
import UserInfoWrapper from '../UserInfo/UserInfoWrapper';
import GroupManagerWrapper from '../GroupManager/GroupManagerWrapper';
import GroupCreatorWrapper from '../GroupManager/GroupCreatorWrapper';
import GroupDetail from '../GroupManager/GroupDetail';
import UserSearch from '../UserSearch/UserSearch';
import AdminAddUser from '../Signup/AdminAddUser';
import UserManagerWrapper from '../UserManager/UserManagerWrapper';
import SchoolManager from '../SchoolManager/SchoolManager';
import SchoolCreator from '../SchoolManager/SchoolCreator';
import ClassroomManager from '../ClassroomManager/ClassroomManager';
import ClassroomDetail from '../ClassroomManager/ClassroomDetail';
import ClassroomCreator from '../ClassroomManager/ClassroomCreator';
import Chat from '../Chat/Chat';
import DirectChat from '../Chat/DirectChat';
import NewChat from '../Chat/NewChat';
import GroupChat from '../Chat/GroupChat';
import ViewChat from '../Chat/ViewChat';
import ChildSignup from '../Signup/ChildSignup';


function App() {
  if (localStorage.getItem('lang') === null) {
    return <Welcome />
  }

  // url routes for all the pages in the app, ones that lead to wrappers are secured
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}></Route>
          <Route path="/dashboard" element={<DashboardWrapper/ >}></Route>
          <Route path="/welcome" element={<Welcome/ >}></Route>
          <Route path="/userinfo" element={<UserInfoWrapper/ >}></Route>
          <Route path="/groupmanager" element={<GroupManagerWrapper/ >}></Route>
          <Route path="/usermanager" element={<UserManagerWrapper/ >}></Route>
          <Route path="/groupcreator" element={<GroupCreatorWrapper/ >}></Route>
          <Route path="/adminadduser" element={<AdminAddUser/ >}></Route>
          <Route path="/groupdetail" element={<GroupDetail/ >}></Route>
          <Route path="/login" element={<Login/ >}></Route>
          <Route path="/signup" element={<Signup/ >}></Route>
          <Route path="/activities" element={<Activities/ >}></Route>
          <Route path = "/searchuser" element= {<UserSearch />}> </Route>
          <Route path="/chat" element= {<Chat/>}></Route>
          <Route path="/directchat" element= {<DirectChat/>}></Route>
          <Route path="/newchat" element= {<NewChat/>}></Route>
          <Route path="/groupchat" element= {<GroupChat/>}></Route>
          <Route path="/viewchat" element= {<ViewChat/>}></Route>
          <Route path="/schoolmanager" element={<SchoolManager/ >}></Route>
          <Route path="/schoolcreator" element={<SchoolCreator/ >}></Route>
          <Route path="/classroommanager" element={<ClassroomManager/ >}></Route>
          <Route path="/classroomdetail" element={<ClassroomDetail/ >}></Route>
          <Route path="/classroomcreator" element={<ClassroomCreator/ >}></Route>
          <Route path="/childsignup" element={<ChildSignup/ >}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
