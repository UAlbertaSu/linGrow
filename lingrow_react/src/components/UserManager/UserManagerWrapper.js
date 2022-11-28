import React, { useState } from 'react';

import DashboardWrapper from '../Dashboard/DashboardWrapper';
import Authenticate from '../Authenticate/Authenticate';
import UserManager from './UserManager';

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
    if (userType === 4) {
        return (<div><UserManager /></div>);
    }
    else {
        return (<div><DashboardWrapper /></div>);
    }
}