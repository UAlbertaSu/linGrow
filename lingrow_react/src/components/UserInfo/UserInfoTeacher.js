import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Group manager component.
export default function UserInfo(AccountType) {


    // TODO: implement hiding of elements based on account type
    AccountType = 'Teacher';

    // headers
    const [account_type_header, setAccountTypeHeader] = useState("Account Type");
    const [username_email_header, setUsernameEmailHeader] = useState("Username/Email");
    const [password_header, setPasswordHeader] = useState("Password");
    const [name_header, setNameHeader] = useState("Name");
    const [classrooms_header, setClassroomsHeader] = useState("Classroom(s)");
    const [schools_header, setSchoolsHeader] = useState("School(s)");


    // TODO: need to get data from backend
    const DUMMY_DATA = [
        {
            "user": {
                "id": 3,
                "email": "parent@parent.com",
                "first_name": "parent",
                "middle_name": "",
                "last_name": "parentson",
                "user_type": 1
            }
        },
    ]


    // textfields
    // TODO: we need to implement password changing
    const [username_email_input, setUsernameEmailInput] = useState(DUMMY_DATA[0].user.email);
    const [password_input, setPasswordInput] = useState("[Password]");
    const [name_input, setNameInput] = useState(DUMMY_DATA[0].user.first_name + " " + DUMMY_DATA[0].user.last_name);
    
    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Account Type").then(response => setAccountTypeHeader(response));
            Translate('en', lang, "Username/Email").then(response => setUsernameEmailHeader(response));
            Translate('en', lang, "Password").then(response => setPasswordHeader(response));
            Translate('en', lang, "Name").then(response => setNameHeader(response));
            Translate('en', lang, "Classroom(s)").then(response => setClassroomsHeader(response));
            Translate('en', lang, "School(s)").then(response => setSchoolsHeader(response));
        }
    });

    useEffect(() => {
        // Prevents page from being constantly translated.
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });
    

    return (
        // TODO: add alignment 
        <Card style={{minHeight:"fit-content", position: "relative"}}>
            <LanguageList />
            <h5>{account_type_header}</h5>
            <h5>{AccountType}</h5>
            <h5>{username_email_header}</h5>
            <input type="text" className="form-control" id="username_email_input" placeholder={username_email_input} onChange={e => setUsernameEmailInput(e.target.value)}/>
            <h5>{password_header}</h5>
            <input type="text" className="form-control" id="password_input" placeholder={password_input} onChange={e => setPasswordInput(e.target.value)} />
            <h5>{name_header}</h5>
            <input type="text" className="form-control" id="name_input" placeholder={name_input} onChange={e => setNameInput(e.target.value)} />
            <h5>{classrooms_header}</h5>
            <h5>{schools_header}</h5>
        </Card>
    );
}