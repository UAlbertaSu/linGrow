import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Group manager component.
export default function UserInfo(AccountType) {

    // TODO: implement hiding of elements based on account type
    AccountType = 'Parent';

    // headers
    const [account_type_header, setAccountTypeHeader] = useState("Account Type");
    const [username_email_header, setUsernameEmailHeader] = useState("Username/Email");
    const [password_header, setPasswordHeader] = useState("Password");
    const [name_header, setNameHeader] = useState("Name");
    const [childs_name_header, setChildsNameHeader] = useState("Child's Name");
    const [teachers_header, setTeachersHeader] = useState("Teacher(s)");
    const [classrooms_header, setClassroomsHeader] = useState("Classroom(s)");
    const [schools_header, setSchoolsHeader] = useState("School(s)");
    const [delete_account_btn, setDeleteAccountBtn] = useState("Delete Account");


    // TODO: Delete later, only for testing
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
        {
            "user": {
                "id": 8,
                "email": "parent2@email.com",
                "first_name": "parent",
                "middle_name": "",
                "last_name": "parent",
                "user_type": 1
            }
        },
        {
            "user": {
                "id": 9,
                "email": "parent3@email.com",
                "first_name": "parent3",
                "middle_name": "",
                "last_name": "thirdParent",
                "user_type": 1
            }
        }
    ]



    // textfields
    // TODO: we need the specific parent id for this
    // TODO: we need password (and childs name)
    const [username_email_input, setUsernameEmailInput] = useState(DUMMY_DATA[0].user.email);
    const [password_input, setPasswordInput] = useState("");
    const [name_input, setNameInput] = useState(DUMMY_DATA[0].user.first_name + " " + DUMMY_DATA[0].user.last_name);
    const [childs_name_input, setChildsNameInput] = useState("");
    
    
    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Account Type").then(response => setAccountTypeHeader(response));
            Translate('en', lang, "Username/Email").then(response => setUsernameEmailHeader(response));
            Translate('en', lang, "Password").then(response => setPasswordHeader(response));
            Translate('en', lang, "Name").then(response => setNameHeader(response));
            Translate('en', lang, "Child's Name").then(response => setChildsNameHeader(response));
            Translate('en', lang, "Teacher(s)").then(response => setTeachersHeader(response));
            Translate('en', lang, "Classroom(s)").then(response => setClassroomsHeader(response));
            Translate('en', lang, "School(s)").then(response => setSchoolsHeader(response));
            Translate('en', lang, "Delete Account").then(response => setDeleteAccountBtn(response));    
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
        <Card style={{minHeight:"fit-content"}}>
            <LanguageList />

            <input type="text" className="form-control" id="username_email_input" placeholder={username_email_input} onChange={e => setUsernameEmailInput(e.target.value)}/>
            <input type="text" className="form-control" id="password_input" placeholder={password_input} onChange={e => setPasswordInput(e.target.value)} />
            <input type="text" className="form-control" id="name_input" placeholder={name_input} onChange={e => setNameInput(e.target.value)} />
            <input type="text" className="form-control" id="childs_name_input" placeholder={childs_name_input} onChange={e => setChildsNameInput(e.target.value)} />
     
        </Card>
    );
}