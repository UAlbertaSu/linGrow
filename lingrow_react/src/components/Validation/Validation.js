import { useState } from 'react';

import retrieveUserType from "../Login/Login";

function Validation() {

    const [userType, setUserType] = useState();
    let token = sessionStorage.getItem('token');

    retrieveUserType(token).then(response => {
        setUserType(response.user.user_type);
    });

    





}

export default Validation;