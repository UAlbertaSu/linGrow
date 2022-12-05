import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import DashNav from '../DashNav/DashNav';

import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";
import {Helmet} from 'react-helmet';
import logo from   "../Img/lingrow.png";

// Allows users to view classrooms
export default function ClassroomManager() {
    const nav = useNavigate();
    let location = useLocation();

    // State variables.
    const [tab_header, setTabHeader] = useState("LinGrow Class Manager");
    const [group_display_header, setHeader] = useState("Classroom Manager");
    const [no_group_message, setNoGroupsFound] = useState("No classrooms have been made yet...");
    const [create_classroom_btn, setCreateClassroomBtn] = useState("Create Classrooms");
    const [translated, setTranslated] = useState(0);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(0);

    const setInitialState = () => {

        if (location.state !== null) {
            let arr = [];
            let schoolID = location.state.schoolID;
            let token = JSON.parse(sessionStorage.getItem('token'));

            fetch(`http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/school/${schoolID}/classroom`,{
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
            Translate('en', lang, "LinGrow Class Manager").then((response) => setTabHeader(response));
            Translate('en', lang, "Classroom Manager").then(response => setHeader(response));
            Translate('en', lang, "No classrooms have been made yet...").then(response => setNoGroupsFound(response));
            Translate('en', lang, "Creat New Class").then(response => setCreateClassroomBtn(response));
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
        nav('/classroomcreator', {
            state: {
                schoolID: location.state.schoolID,
            }
        });
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

    const returnToDashboard = (event) => {
        event.preventDefault();
        navigate('/dashboard');
    }

    if (error) {
        return (
            <div>            
                <h1>Page does not exist</h1>
                <a onClick={returnToDashboard}>Return to Dashboard</a>
            </div>
        )
    }
    else {
        return (
            // Allows user to create new classrooms within a school, or view current classrooms and their details.
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
                    <Button variant="primary" type="submit" id="create" style={{minWidth:"100px"}} onClick={handleNavigate}>{create_classroom_btn}</Button>
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
            </div>
        );
    }
}