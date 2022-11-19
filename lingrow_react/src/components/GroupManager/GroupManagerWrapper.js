import React from 'react';

import GroupManager from './GroupManager';
import Dashboard from '../Dashboard/DashboardParent';

export default function GroupManagerWrapper() {
    let userType = parseInt(sessionStorage.getItem('userType'));

    // navigate based on appropriate user type, or login page if user hasn't logged in yet.
    if (userType === 1) {
        return (<div><Dashboard /></div>);
    }
    else {
        return (<div><GroupManager userType={userType} /></div>);
    }
}