import React, { useEffect, useState } from 'react';

import GroupCreator from './GroupCreator';
import DashboardWrapper from '../Dashboard/DashboardWrapper';
import Authenticate from '../Authenticate/Authenticate';

// Navigate users to the group manager component, if the user type is valid (2 = teacher, 3 = researcher, 4 = admin)
export default function GroupManagerWrapper({prevSearchResult}) {

    // User type from sessionStorage.
    const userType = JSON.parse(sessionStorage.getItem('userType'));

    // If the user type is valid, navigate to the group manager component.
    if (userType !== 2 && userType !== 3 && userType !== 4) {
        return (<div><DashboardWrapper /></div>);
    }
    else {
        return (<div><GroupCreator userType={userType} prevSearchResult={prevSearchResult} /></div>);
    }
}