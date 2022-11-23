import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

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