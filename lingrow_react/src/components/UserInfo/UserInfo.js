import React, { useState, useEffect, useCallback } from 'react';
import { Card, Nav, Container, Navbar, Col, Row, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import { retrieveUserType } from '../Login/Login';

import { Helmet } from 'react-helmet';
import logo from "../Img/lingrow.png";
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
    const [password_header, setPasswordHeader] = useState("Password");
    const [name_header, setNameHeader] = useState("First Name");
    const [last_name_header, setLastNameHeader] = useState("Last Name");
    const [childs_name_header, setChildsNameHeader] = useState("Child's Name");
    const [classrooms_header, setClassroomsHeader] = useState("Classroom(s)");
    const [schools_header, setSchoolsHeader] = useState("School(s)");

    // textfields
    // TODO: we need to implement password changing
    // TODO: resolve issue of fields not appearing before refresh
    const [username_email_input, setUsernameEmailInput] = useState(sessionStorage.getItem('user_email'));
    const [password_input, setPasswordInput] = useState("[Password]");
    const [name_input, setNameInput] = useState(sessionStorage.getItem('user_first_name'));
    const [last_name_input, setLastNameInput] = useState("user_last_name");
    const [childs_name_input, setChildsNameInput] = useState(sessionStorage.getItem('child_name'));
    const [schools_name_input, setSchoolsNameInput] = useState(sessionStorage.getItem('child_school'));
    const [classroom_name_input, setClassroomNameInput] = useState(sessionStorage.getItem('child_classroom'));
    const [teacher_schools_name_input, setTeacherSchoolsNameInput] = useState(sessionStorage.getItem('teacher_school'));
    const [teacher_classrooms_name_input, setTeacherClassroomsNameInput] = useState(sessionStorage.getItem('teacher_classrooms'));

    retrieveUserType(token).then(response => {
        let user = response.user;
    
        sessionStorage.setItem('user_email', user.email);
        sessionStorage.setItem('user_first_name', user.first_name);
        sessionStorage.setItem('user_type', user.user_type);

        // if a parent, get the child info
        if (user.user_type === 1) {   
            // get child info 
            return fetch('http://127.0.0.1:8000/api/user/child', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {

                sessionStorage.setItem('child_name', data[0]['first_name']);
                sessionStorage.setItem('child_school', data[0]['school']);
                sessionStorage.setItem('child_classroom', data[0]['classroom']);        
            });   
        }

        // if a teacher, get the teacher info
        if (user.user_type === 2) {
            sessionStorage.setItem('teacher_school', user.school);
            sessionStorage.setItem('teacher_classrooms', user.classrooms);
        }

    });



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
            Translate('en', lang, "Password").then(response => setPasswordHeader(response));
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
    
    // User info page with editable fields for user to change.
    return (
        <div className='bg'>
            <Card style={{minHeight:"fit-content", paddingBottom:"20px"}}>
                <Helmet>
                        <meta charSet="utf-8" />
                        <title>{tab_header}</title>
                </Helmet>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <DashNav/>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px", flexDirection:"column"}}>
                    <Row>
                        <Col className="title_col">
                            <Card.Title style={{margin:"10px 10px 10px 10px", fontWeight:"bold"}}>{account_type_header}</Card.Title>
                            <Card.Title style={{margin:"15px 10px 10px 10px", fontWeight:"bold"}}>{name_header}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{last_name_header}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{username_email_header}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{password_header}</Card.Title>
                            <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{childs_name_header}</Card.Title> : null}</div>
                            <div>{userType === 1 || userType === 2 || userType === 3 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{schools_header}</Card.Title> : null}</div>
                            <div>{userType === 1 || userType === 2 || userType === 3 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{classrooms_header}</Card.Title> : null}</div>
                        </Col>
                        <Col className="info_col">
                            <div>{userType === 1 ? <Card.Title style={{margin:"10px"}}>{parent}</Card.Title> : null}</div>
                            <div>{userType === 2 ? <Card.Title style={{margin:"10px"}}>{teacher}</Card.Title> : null}</div>
                            <div>{userType === 3 ? <Card.Title style={{margin:"10px"}}>{researcher}</Card.Title> : null}</div>
                            <div>{userType === 4 ? <Card.Title style={{margin:"10px"}}>{admin}</Card.Title> : null}</div>
                            <input type="text" className="form-control" id="name_input" placeholder={name_input} onChange={e => setNameInput(e.target.value)} />
                            <input type="text" className="form-control" id="last_name_input" placeholder={last_name_input} onChange={e => setLastNameInput(e.target.value)}/>
                            <input type="text" className="form-control" id="username_email_input" placeholder={username_email_input} onChange={e => setUsernameEmailInput(e.target.value)}/>
                            <input type="text" className="form-control" id="password_input" placeholder={password_input} onChange={e => setPasswordInput(e.target.value)} />
                            <div>{userType === 1 ? <input type="text" className="form-control" id="childs_name_input" placeholder={childs_name_input} onChange={e => setChildsNameInput(e.target.value)} /> : null}</div>
                            <div>{userType === 1 ? <input type="text" className="form-control" id="schools_name_input" placeholder={schools_name_input} onChange={e => setSchoolsNameInput(e.target.value)} /> : null}</div>
                            <div>{userType === 1 ? <input type="text" className="form-control" id="classroom_name_input" placeholder={classroom_name_input} onChange={e => setClassroomNameInput(e.target.value)} /> : null}</div>
                            <div>{userType === 2 ? <input type="text" className="form-control" id="teacher_schools_name_input" placeholder={teacher_schools_name_input} onChange={e => setTeacherSchoolsNameInput(e.target.value)} /> : null}</div>
                            <div>{userType === 2 ? <input type="text" className="form-control" id="teacher_classrooms_name_input" placeholder={teacher_classrooms_name_input} onChange={e => setTeacherClassroomsNameInput(e.target.value)} /> : null}</div>
                        
                        </Col>
                    </Row>
                </Card>
            </Card>
        </div>
    );
}