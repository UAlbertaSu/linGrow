import React, { useState, useEffect, useCallback } from 'react';
import { Card, Nav, Container, Navbar, Col, Row, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import { retrieveUserType } from '../Login/Login';

import { Helmet } from 'react-helmet';
import logo from "../Img/blank_lingrow.png";
import DashNav from '../DashNav/DashNav';


// Group manager component.
export default function UserInfo({ userType }) {

    const setDashboardType = () => {
        if (userType === 1) {
            return 'LinGrow Parent Dashboard';
        }
        else if (userType === 2) {
            return 'LinGrow Teacher Dashboard';
        }
        else if (userType === 3) {
            return 'LinGrow Researcher Dashboard';
        }
        else if (userType === 4) {
            return 'LinGrow Admin Dashboard';
        }
    }

    // headers
    const [token] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [tab_header, setTabHeader] = useState("Lingrow User Info");
    const [parent, setParent] = useState("Parent");
    const [teacher, setTeacher] = useState("Teacher");
    const [researcher, setResearcher] = useState("Researcher");
    const [admin, setAdmin] = useState("Admin");
    const [account_type_header, setAccountTypeHeader] = useState("Account Type");
    const [username_email_header, setUsernameEmailHeader] = useState("Username/Email");
    const [name_header, setNameHeader] = useState("First Name");
    const [last_name_header, setLastNameHeader] = useState("Last Name");
    const [childs_name_header, setChildsNameHeader] = useState("Child's Name");
    const [classrooms_header, setClassroomsHeader] = useState("Classroom(s)");
    const [schools_header, setSchoolsHeader] = useState("School(s)");

    // textfields
    const [username_email_input, setUsernameEmailInput] = useState();
    const [name_input, setNameInput] = useState();
    const [last_name_input, setLastNameInput] = useState();
    const [childs_name_input, setChildsNameInput] = useState();
    const [schools_name_input, setSchoolsNameInput] = useState();
    const [classroom_name_input, setClassroomNameInput] = useState();
    const [teacher_schools_name_input, setTeacherSchoolsNameInput] = useState();
    const [teacher_classrooms_name_input, setTeacherClassroomsNameInput] = useState();

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Parent").then(response => setParent(response));
            Translate('en', lang, "Teacher").then(response => setTeacher(response));
            Translate('en', lang, "Researcher").then(response => setResearcher(response));
            Translate('en', lang, "Admin").then(response => setAdmin(response));
            Translate('en', lang, "Account Type").then(response => setAccountTypeHeader(response));
            Translate('en', lang, "Username/Email").then(response => setUsernameEmailHeader(response));
            Translate('en', lang, "First Name").then(response => setNameHeader(response));
            Translate('en', lang, "Last Name").then(response => setLastNameHeader(response));
            Translate('en', lang, "Child's Name").then(response => setChildsNameHeader(response));
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

    useEffect(() => {
        retrieveUserType(token).then(response => {
            let user = response.user;
        
            setUsernameEmailInput(user.email);
            setNameInput(user.first_name);
            setLastNameInput(user.last_name);

            // if a parent, get the child info
            if (user.user_type === 1) {   
                // get child info 
                return fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/user/child', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }).then(data => data.json()
                ).then(data => {
                    setChildsNameInput(data[0]['first_name']);
                    setSchoolsNameInput(data[0]['school']);
                    setClassroomNameInput(data[0]['classroom']);        
                });   
            }

            // if a teacher, get the teacher info
            if (user.user_type === 2) {
                setTeacherSchoolsNameInput(user.school);
                setTeacherClassroomsNameInput(user.classrooms);
            }
        });
    })
    
    // User info page with editable fields for user to change.
    return (
        <div className='bg'>
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <Helmet>
                        <meta charSet="utf-8" />
                        <title>{tab_header}</title>
                </Helmet>
                <a href="https://bilingualacquisition.ca/"></a>
                <LanguageList />
                <DashNav/>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px", flexDirection:"column"}}>
                    <Row>
                        <Col className="title_col">
                            <Card.Title style={{margin:"10px 10px 10px 10px", fontWeight:"bold"}}>{account_type_header}</Card.Title>

                            <Card.Title style={{margin:"15px 10px 10px 10px", fontWeight:"bold"}}>{name_header}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{last_name_header}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{username_email_header}</Card.Title>
                            <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{childs_name_header}</Card.Title> : null}</div>
                            <div>{userType === 1 || userType === 2 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{schools_header}</Card.Title> : null}</div>
                            <div>{userType === 1 || userType === 2 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{classrooms_header}</Card.Title> : null}</div>
                        </Col>
                        <Col className="info_col">

                            <div>{userType === 1 ? <Card.Title style={{margin:"10px"}}>{parent}</Card.Title> : null}</div>
                            <div>{userType === 2 ? <Card.Title style={{margin:"10px"}}>{teacher}</Card.Title> : null}</div>
                            <div>{userType === 3 ? <Card.Title style={{margin:"10px"}}>{researcher}</Card.Title> : null}</div>
                            <div>{userType === 4 ? <Card.Title style={{margin:"10px"}}>{admin}</Card.Title> : null}</div>
                            <Card.Title style={{margin:"15px 10px 10px 10px"}}>{name_input}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px"}}>{last_name_input}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px"}}>{username_email_input}</Card.Title>
                            <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px"}}>{childs_name_input}</Card.Title> : null} </div>
                            <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px"}}>{schools_name_input}</Card.Title> : null}</div>
                            <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px"}}>{classroom_name_input}</Card.Title> : null}</div>
                            <div>{userType === 2 ? <Card.Title style={{margin:"20px 10px 10px 10px"}}>{teacher_schools_name_input}</Card.Title> : null}</div>
                            <div>{userType === 2 ? <Card.Title style={{margin:"20px 10px 10px 10px"}}>{teacher_classrooms_name_input}</Card.Title> : null}</div>

                        </Col>
                    </Row>
                </Card>
            </Card>
        </div>
    );
}