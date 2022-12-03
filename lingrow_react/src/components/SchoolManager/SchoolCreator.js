import React, { setState, useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Allows users to create a new school
export default function SchoolCreator({}) {
    const loc = useLocation();
    const nav = useNavigate();

    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));

    const [group_create_header, setHeader] = useState("Create New Group");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [group_name, setGroupName] = useState(loc.state !== null ? loc.state.groupName : "Group Name");
    const [email_name, setEmailName] = useState(loc.state !== null ? loc.state.groupName : "Email");
    const [group_id, setGroupID] = useState("Group ID");

    // Sets the initial state of search results.

    const handleCreate = (e) => {
        e.preventDefault();

        let method = 'POST';
        if (loc.state !== null) {
            method = 'PATCH';
        }

        var request = {
            'name': group_name,
            'email': email_name,
        }

        let url = 'http://127.0.0.1:8000/api/school/'

        if (loc.state !== null) {
            url += loc.state.schoolID + '/';
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        }).then(() => {
            nav('/schoolmanager');
        }).catch(error => {
            console.log(error);
        })
    }

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Create New School").then(response => setHeader(response));
            Translate('en', lang, "Create School").then(response => setSubmitBtn(response));
            Translate('en', lang, "School Name").then(response => setGroupName(response));
            Translate('en', lang, "School Email").then(response => setEmailName(response));
            Translate('en', lang, "School ID").then(response => setGroupID(response));
        }
    });

    // Translate the page and populate the list of users once the page load.
    useEffect(() => {

        // Prevent translation from running multiple times.
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        // If the new language change is detected, translate the page.
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <Card style={{minHeight:"fit-content"}}>
            <LanguageList />
            <h1>{group_create_header}</h1>
            <input type="text" className="form-control" id="school_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
            <input type="text" className="form-control" id="school_email" placeholder={email_name} onChange={e => setEmailName(e.target.value)}/>
            <input type="text" className="form-control" id="school_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
            
            <Button variant="primary" type="submit" id="submit" style={{minWidth:"100px"}} onClick={handleCreate}>{submit_btn}</Button>
        </Card>
    );
}