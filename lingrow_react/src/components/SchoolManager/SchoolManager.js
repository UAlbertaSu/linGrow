import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";

// Allows users to view schools
export default function SchoolManager({userType}) {
    const nav = useNavigate();

    // State variables.
    const [group_display_header, setHeader] = useState("School Manager");
    const [no_group_message, setNoGroupsFound] = useState("No schools have been made yet...");
    const [translated, setTranslated] = useState(0);
    const [groups, setGroups] = useState([]);
    const [token] = useState(JSON.parse(sessionStorage.getItem('token')));

    const setInitialState = () => {
        let arr = [];

        fetch('http://127.0.0.1:8000/api/school', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(data => data.json()
        ).then(data => {
            data.map((item) => {
                arr.push(item);
            })
        }).then(() => {
            setGroups([...groups, ...arr]);
        });
    }
        

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "School Manager").then(response => setHeader(response));
            Translate('en', lang, "No schools have been made yet...").then(response => setNoGroupsFound(response));
        }
    });


    // Navigate to the page showing user details of each group.
    const handleDetail = (elem) => {

        nav(`/classroommanager`, {
            state: {
                schoolID: elem.id,
            }
        });
    }

    // to create a school
    const handleNavigate = async (e) => {
        nav('/schoolcreator');
    }


    // Populate the list of groups made by user, and translate the page.
    useEffect(() => {

        // Prevent multiple translation calls, and multiple group fetch calls.
        if (!translated) {
            setInitialState();
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
            <h1>{group_display_header}</h1>
            <Button variant="primary" type="submit" id="create" style={{minWidth:"100px"}} onClick={handleNavigate}>Create New Group</Button>
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                {
                    groups.length > 0 ? 
                        <ListGroup>
                            {groups.map((elem) => 
                            <ListGroup.Item action onClick={() => handleDetail(elem)} id={elem.id} key={elem.id} value={elem.id}>
                                {[elem.name]}
                            </ListGroup.Item>)}
                        </ListGroup> 
                    :
                        <ListGroup>{<ListGroup.Item disabled >{no_group_message}</ListGroup.Item>}</ListGroup>
                }
            </div>
        </Card>
    );
}