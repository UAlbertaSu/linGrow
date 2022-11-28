import React, { useState } from 'react';
import './Dashboard.css';

import Dashboard from './Dashboard';
import Login from '../Login/Login';
import Authenticate from '../Authenticate/Authenticate';

export default function DashboardWrapper() {

    // State variable.
    const [userType, setUserType] = useState();

    // Authenticate user via token.
    Authenticate(JSON.parse(sessionStorage.getItem('token'))).then(response => {
        let user = response.user;
        setUserType(user.user_type);
    }).catch(error => {
        console.log("Validation failed: ", error);
    });

    // If the user type is valid, navigate to the dashboard component.
    if (userType !== undefined) {
        return (<div><Dashboard userType={userType} /></div>);
    }
    else {
        return (<div><Login /></div>);
    }
}