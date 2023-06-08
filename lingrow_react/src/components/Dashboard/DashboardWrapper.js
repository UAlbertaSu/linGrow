
import React, { useState } from 'react';
import './Dashboard.css';

import Dashboard from './Dashboard';
import Login from '../Login/Login';
import Authenticate from '../Authenticate/Authenticate';

export default function DashboardWrapper() {

    // User type from sessionStorage.
    const userType = JSON.parse(sessionStorage.getItem('userType'));

    // If the user type is valid, navigate to the dashboard component.
    if (userType !== undefined) {
        return (<div><Dashboard userType={userType} /></div>);
    }
    else {
        return (<div><Login /></div>);
    }
}
