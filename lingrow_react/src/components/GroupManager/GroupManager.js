import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";

// Allows users to view parent/teacher/researcher groups that they have created.
export default function GroupManager({userType}) {
    const nav = useNavigate();
    const [group_display_header, setHeader] = useState("Groups");

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);
    const [groups, setGroups] = useState([]);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [flagSet, setFlagSet] = useState(0);

    const setInitialState = () => {
        let arr = [];
        console.log(token)

        if (userType === 4) { // Admin can add all users into group.
            arr = [];

            fetch('http://127.0.0.1:8000/api/group/researchergroup', {
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

        if (userType === 3 || userType === 4) { // Admin and researcher can add teachers and parents into group.
            arr = [];

            fetch('http://127.0.0.1:8000/api/group/teachergroup', {
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

        if (userType === 2 || userType === 3 || userType === 4) { // Admin, researcher, and teacher can add parents into group.
            arr = [];

            fetch('http://127.0.0.1:8000/api/group/parentgroup', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                console.log("Parent group: ", data);
                data.map((item) => {
                    arr.push(item);
                })
            }).then(() => {
                setGroups([...groups, ...arr]);
            });
        }
    }

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Groups").then(response => setHeader(response));
        }
    });

    // 
    const handleDetail = (elem) => {

        var groupType = '';

        if (elem.hasOwnProperty('researcher')) {
            groupType = 'researcher';
        }
        else if (elem.hasOwnProperty('teacher')) {
            groupType = 'teacher';
        }
        else if (elem.hasOwnProperty('parent')) {
            groupType = 'parent';
        }

        nav(`/groupdetail/`, {
            state: {
                groupID: elem.id,
                groupType: groupType,
            }
        });
    }

    const handleNavigate = async (e) => {
        nav('/groupcreator');
    }

    useEffect(() => {
        // Prevents page from being constantly translated.
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    useEffect(() => {
        if (!flagSet) {
            setInitialState();
            setFlagSet(1);
        }
    }, []);

    return (
        <Card style={{minHeight:"fit-content"}}>
            <LanguageList />
            <h1>{group_display_header}</h1>
            <Button variant="primary" type="submit" id="create" style={{minWidth:"100px"}} onClick={handleNavigate}>Create New Group</Button>
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                <ListGroup>
                    {groups.map((elem) => 
                    <ListGroup.Item action onClick={() => handleDetail(elem)} key={elem.id} value={elem.id}>
                        {[elem.name]}
                    </ListGroup.Item>)}
                </ListGroup>
            </div>
        </Card>
    );
}