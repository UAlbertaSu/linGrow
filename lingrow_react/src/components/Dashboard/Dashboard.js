import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

import DashboardAdmin from './DashboardAdmin';
import DashboardParent from './DashboardParent';
import DashboardTeacher from './DashboardTeacher';
import DashboardResearcher from './DashboardResearcher';
import Login from '../Login/Login';

export default function Dashboard() {
    const nav = useNavigate();
    let userType = parseInt(sessionStorage.getItem('userType'));

    // navigate based on appropriate user type, or login page if user hasn't logged in yet.
    switch(userType) {
        case 1:
            return (<div><DashboardParent /></div>);
        case 2:
            return (<div><DashboardTeacher /></div>);
        case 3:
            return (<div><DashboardResearcher /></div>);
        case 4:
            return (<div><DashboardAdmin /></div>);
        default:
            return (<div><Login /></div>);
    }
}