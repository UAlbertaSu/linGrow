import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";

// Allows users to view classrooms
export default function ClassroomManager() {
    const nav = useNavigate();
    let location = useLocation();

    // State variables.
    const [group_display_header, setHeader] = useState("Classroom Manager");
    const [no_group_message, setNoGroupsFound] = useState("No classrooms have been made yet...");
    const [translated, setTranslated] = useState(0);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(0);

    const setInitialState = () => {

        if (location.state !== null) {
            let arr = [];
            let schoolID = location.state.schoolID;
            let token = JSON.parse(sessionStorage.getItem('token'));

            fetch(`http://127.0.0.1:8000/api/school/${schoolID}/classroom`,{
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
        else {
            setError(1);
        }
    }

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Classroom Manager").then(response => setHeader(response));
            Translate('en', lang, "No classrooms have been made yet...").then(response => setNoGroupsFound(response));
        }
    });

    // Navigate to the page showing user details of each group.
    const handleDetail = (elem) => {

        nav(`/classroomdetail`, {
            state: {
                schoolID: elem.school.id,
                classroomID: elem.id,
            }
        });    
    }

    // If user clicks a group creation button, navigate user to the group creation page.
    const handleNavigate = async (e) => {
        nav('/classroomcreator');
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


    if (error) {
        return (
            <div>            
                <h1>Page does not exist</h1>
                <a href="/dashboard">Return to Dashboard</a>
            </div>
        )
    }
    else {
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
}