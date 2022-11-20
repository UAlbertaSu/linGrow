import React from 'react';

import GroupManager from './GroupManager';
import Dashboard from '../Dashboard/DashboardParent';

// Navigate users to the group manager component, if the user type is valid (2 = teacher, 3 = researcher, 4 = admin)
export default function GroupManagerWrapper() {
    let userType = parseInt(sessionStorage.getItem('userType'));

    if (userType !== 2 && userType !== 3 && userType !== 4) {
        return (<div><Dashboard /></div>);
    }
    else {
        return (<div><GroupManager userType={userType} /></div>);
    }
}