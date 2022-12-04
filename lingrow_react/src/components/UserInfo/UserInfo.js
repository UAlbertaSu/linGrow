import React, { useState, useEffect, useCallback } from 'react';
import { Card, Nav, Container, Navbar, Col, Row, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import { retrieveUserType } from '../Login/Login';

import logo from "../Img/lingrow.png";
import clouds from '../Img/clouds.png';
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";


// Group manager component.
export default function UserInfo({ userType }) {

    retrieveUserType(JSON.parse(sessionStorage.getItem('token'))).then(response => {
        let user = response.user;
        sessionStorage.setItem('user_email', user.email);
        sessionStorage.setItem('user_first_name', user.first_name);
    });

    // headers
    const [dashboard, setDashboard] = useState("User Info");
    const [parent, setParent] = useState("Parent");
    const [teacher, setTeacher] = useState("Teacher");
    const [researcher, setResearcher] = useState("Researcher");
    const [admin, setAdmin] = useState("Admin");
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [account_type_header, setAccountTypeHeader] = useState("Account Type");
    const [username_email_header, setUsernameEmailHeader] = useState("Username/Email");
    const [password_header, setPasswordHeader] = useState("Password");
    const [name_header, setNameHeader] = useState("First Name");
    const [last_name_header, setLastNameHeader] = useState("Last Name");
    const [childs_name_header, setChildsNameHeader] = useState("Child's Name");
    const [teachers_header, setTeachersHeader] = useState("Teacher(s)");
    const [classrooms_header, setClassroomsHeader] = useState("Classroom(s)");
    const [schools_header, setSchoolsHeader] = useState("School(s)");

    // textfields
    // TODO: we need to implement password changing
    // TODO: need to implement child name getting
    // TODO: resolve issue of fields not appearing before refresh
    const [username_email_input, setUsernameEmailInput] = useState(sessionStorage.getItem('user_email'));
    const [password_input, setPasswordInput] = useState("[Password]");
    const [name_input, setNameInput] = useState(sessionStorage.getItem('user_first_name'));
    const [last_name_input, setLastNameInput] = useState("user_last_name");
    const [childs_name_input, setChildsNameInput] = useState("[Child's Name]");

    
    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "User Info").then(response => setDashboard(response));
            Translate('en', lang, "Parent").then(response => setParent(response));
            Translate('en', lang, "Teacher").then(response => setTeacher(response));
            Translate('en', lang, "Researcher").then(response => setResearcher(response));
            Translate('en', lang, "Admin").then(response => setAdmin(response));
            Translate('en', lang, "Home").then(response => setHome(response));
            Translate('en', lang, "Profile").then(response => setProfile(response));
            Translate('en', lang, "Account Type").then(response => setAccountTypeHeader(response));
            Translate('en', lang, "Username/Email").then(response => setUsernameEmailHeader(response));
            Translate('en', lang, "Password").then(response => setPasswordHeader(response));
            Translate('en', lang, "First Name").then(response => setNameHeader(response));
            Translate('en', lang, "Last Name").then(response => setLastNameHeader(response));
            Translate('en', lang, "Child's Name").then(response => setChildsNameHeader(response));
            Translate('en', lang, "Teacher(s)").then(response => setTeachersHeader(response));
            Translate('en', lang, "Classroom(s)").then(response => setClassroomsHeader(response));
            Translate('en', lang, "School(s)").then(response => setSchoolsHeader(response));
        }
    });

    const createSchoolList = () => {
        
    }

    const createClassroomList = () => {

    }

    useEffect(() => {

    }, []);

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
        <Card style={{minHeight:"fit-content", paddingBottom:"20px"}}>
            <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
            <LanguageList />
            <Navbar bg="light" expand="lg" style={{width:"94%", margin: "20px 0px 10px 0px"}}>
                <Container>
                        <div>{userType === 1 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"30px",margin:"10px 50px 10px 20px"}}>Lingrow {parent} {dashboard}</Navbar.Brand> : null}</div>
                        <div>{userType === 2 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"30px",margin:"10px 50px 10px 20px"}}>Lingrow {teacher} {dashboard}</Navbar.Brand> : null}</div>
                        <div>{userType === 3 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"30px",margin:"10px 50px 10px 20px"}}>Lingrow {researcher} {dashboard}</Navbar.Brand> : null}</div>
                        <div>{userType === 4 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"30px",margin:"10px 50px 10px 20px"}}>Lingrow {admin} {dashboard}</Navbar.Brand> : null}</div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <img src={home_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                        <Nav.Link href="dashboard" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{home}</Nav.Link>
                        <img src={user_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                        <Nav.Link style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px", color:"black"}}>{profile}</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px", flexDirection:"column"}}>
                <Row>
                    <Col className="title_col">
                        <Card.Title style={{margin:"10px 10px 10px 10px", fontWeight:"bold"}}>{account_type_header}</Card.Title>
                        <Card.Title style={{margin:"15px 10px 10px 10px", fontWeight:"bold"}}>{name_header}</Card.Title>
                        <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{last_name_header}</Card.Title>
                        <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{username_email_header}</Card.Title>
                        <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{password_header}</Card.Title>
                        <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{childs_name_header}</Card.Title> : null}</div>
                        <div>{userType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{teachers_header}</Card.Title> : null}</div>
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
                        <div>{userType === 1 ? <h5>{childs_name_header}</h5> : null}</div>
                        <div>{userType === 2 ? (<select id="school-select" className="form-control">
                            <option disabled selected value> -- select an option -- </option>
                        </select>) : (
                            null
                        )}</div>
                        <div>{userType === 2 ? (<select id="classroom-select" className="form-control">
                            <option disabled selected value> -- select an option -- </option>
                        </select>) : (
                            null
                        )}</div>
                    </Col>
                </Row>
            </Card>
        </Card>
    );
}