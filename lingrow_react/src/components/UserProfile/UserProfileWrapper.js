import React from 'react';

import UserProfile from './UserProfile';
import Login from '../Login/Login';

export default function UserProfileWrapper() {
    let userType = parseInt(sessionStorage.getItem('userType'));

    if (userType !== undefined) {
        return (<div><UserProfile userType={userType} /></div>);
    }
    else {
        return (<div><Login /></div>);
    }
}