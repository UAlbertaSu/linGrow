import React, { useState } from 'react';

import GroupManager from './GroupManager';
import DashboardWrapper from '../Dashboard/DashboardWrapper';
import Authenticate from '../Authenticate/Authenticate';

// Navigate users to the group manager component, if the user type is valid (2 = teacher, 3 = researcher, 4 = admin)
export default function GroupManagerWrapper() {

    // State variable.
    const [userType, setUserType] = useState();

    // Authenticate user via token.
    Authenticate(JSON.parse(sessionStorage.getItem('token'))).then(response => {
        let user = response.user;
        setUserType(user.user_type);
    }).catch(error => {
        console.log("Validation failed: ", error);
    });

    // If the user type is valid, navigate to the group manager component.
    if (userType !== 2 && userType !== 3 && userType !== 4) {
        return (<div><DashboardWrapper /></div>);
    }
    else {
        return (<div><GroupManager userType={userType} /></div>);
    }
}