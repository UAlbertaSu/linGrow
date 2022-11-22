import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

import DashboardAdmin from './DashboardAdmin';
import DashboardParent from './DashboardParent';
import DashboardTeacher from './DashboardTeacher';
import DashboardResearcher from './DashboardResearcher';


import Dashboard from './Dashboard';
import Login from '../Login/Login';

export default function DashboardWrapper() {
    const nav = useNavigate();
    let userType = parseInt(sessionStorage.getItem('userType'));

    if (userType !== undefined) {
        return (<div><Dashboard userType={userType} /></div>);
    }
    else {
        return (<div><Login /></div>);
    }
}

    // navigate based on appropriate user type, or login page if user hasn't logged in yet.
    // switch(userType) {
    //     case 1:
    //         return (<div><DashboardParent /></div>);
    //     case 2:
    //         return (<div><DashboardTeacher /></div>);
    //     case 3:
    //         return (<div><DashboardResearcher /></div>);
    //     case 4:
    //         return (<div><DashboardAdmin /></div>);
    //     default:
    //         return (<div><Login /></div>);
    // }