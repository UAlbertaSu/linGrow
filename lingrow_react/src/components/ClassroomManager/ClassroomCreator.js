import React, { setState, useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Allows users to create a new parent, teacher, or researcher group.
export default function ClassroomCreator({userType}) {
    const loc = useLocation();
    const nav = useNavigate();

    // const [selected, setSelected] = useState(loc.state !== null ? loc.state.groupMembers : []);
    // const [searchResult, setSearchResult] = useState([]);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [group_create_header, setHeader] = useState("Create New Classroom");
    const [submit_btn, setSubmitBtn] = useState("Create Classroom");
    const [group_name, setGroupName] = useState(loc.state !== null ? loc.state.groupName : "Classroom Name");
    const [group_id, setGroupID] = useState("Classroom ID");

    const handleCreate = (e) => {
        e.preventDefault();
        var request = {
            'name': group_name,
            'school': loc.state.schoolID,
        }
        let url = `http://127.0.0.1:8000/api/school/${loc.state.schoolID}/classroom/`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        }).then(() => {
            nav('/classroommanager', {
                state: {
                    schoolID: loc.state.schoolID,
                }
            });
        }).catch(error => {
            console.log(error);
        })
           
    }

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Create New Classroom").then(response => setHeader(response));
            Translate('en', lang, "Create Classroom").then(response => setSubmitBtn(response));
            Translate('en', lang, "Classroom Name").then(response => setGroupName(response));
            Translate('en', lang, "Classroom ID").then(response => setGroupID(response));
        }
    });

    // Translate the page and populate the list of users once the page load.
    useEffect(() => {

        // Prevent translation and list population from running multiple times.
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
            <input type="text" className="form-control" id="group_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
            <input type="text" className="form-control" id="group_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
            <Button variant="primary" type="submit" id="submit" style={{minWidth:"100px"}} onClick={handleCreate}>{submit_btn}</Button>
        </Card>
    );
}