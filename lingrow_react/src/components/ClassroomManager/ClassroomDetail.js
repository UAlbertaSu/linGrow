import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Navbar, Nav, Container } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import {Helmet} from 'react-helmet';

import logo from "../Img/lingrow.png";
import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";
import DashNav from '../DashNav/DashNav';

// Allows users to view classrooms
export default function ClassroomManager() {
    const nav = useNavigate();
    let location = useLocation();

    const userType = JSON.parse(sessionStorage.getItem('userType'));
    // State variables.
    const [tab_header, setTabHeader] = useState("LinGrow Class Detail");
    const [group_display_header, setHeader] = useState("Single classroom");
    const [no_group_message, setNoGroupsFound] = useState("No users are in this classroom yet...");
    const [translated, setTranslated] = useState(0);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(0);

    // TODO: how to add users to classroom
    const setInitialState = () => {

        if (location.state !== null) {
            let arr = [];
            let schoolID = location.state.schoolID;
            let classroomID = location.state.classroomID;
            let token = JSON.parse(sessionStorage.getItem('token'));

            fetch(`http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/school/${schoolID}/classroom/${classroomID}`,{
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
            Translate('en', lang, "LinGrow Class Detail").then((response) => setTabHeader(response));
            Translate('en', lang, "Single classroom").then(response => setHeader(response));
            Translate('en', lang, "No users are in this classroom yet...").then(response => setNoGroupsFound(response));
        }
    });

    // no actions will be taken on selecting users


    // If user clicks add users, navigate to user manager
    // TODO: need to change this so we can add users to classrooms
    const handleNavigate = async (e) => {
        nav('/usermanager');
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
            <div className='bg'>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <DashNav/>
                <h1>{group_display_header}</h1>
                <Button variant="primary" type="submit" id="create" style={{minWidth:"100px"}} onClick={handleNavigate}>Create New Group</Button>
                <div style={{ display: 'block', width: 400, padding: 30 }}>
                    {
                        groups.length > 0 ? 
                            <ListGroup>
                                {groups.map((elem) => 
                                <ListGroup.Item id={elem.id} key={elem.id} value={elem.id}>
                                    {[elem.name]}
                                </ListGroup.Item>)}
                            </ListGroup> 
                        :
                            <ListGroup>{<ListGroup.Item disabled >{no_group_message}</ListGroup.Item>}</ListGroup>
                    }
                </div>
            </Card>
            </div>
        );
    }
}