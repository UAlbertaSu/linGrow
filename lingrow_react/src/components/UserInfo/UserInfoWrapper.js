import React from 'react';

import UserInfo from './UserInfo';
import Login from '../Login/Login';

export default function UserInfoWrapper() {
    let userType = parseInt(sessionStorage.getItem('userType'));

    if (userType !== undefined) {
        return (<div><UserInfo userType={userType} /></div>);
    }
    else {
        return (<div><Login /></div>);
    }
}