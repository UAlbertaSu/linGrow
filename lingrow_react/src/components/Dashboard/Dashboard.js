import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card, Button, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";

export default function Dashboard({ userType }) {
    const nav = useNavigate();

    // Sets dashboard message based on user type retrieved from sessionStorage.
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

    // State variables.
    const [dashboardString, setDashboardString] = useState(setDashboardType);
    const [dashboard, setDashboard] = useState();
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [chat, setChatMsg] = useState("Chat");
    const [manageSchools, setManageSchools] = useState("Manage Schools");
    const [manageUsers, setManageUsers] = useState("Manage Users");
    const [searchUsers, setSearchUsers] = useState("Search Users");
    const [group_manager, setGroupManagerMsg] = useState("Group Manager");
    const [activities, setLanguageLearningActivitiesMsg] = useState("Language Learning Activities");
    const [logout_msg, setLogoutMsg] = useState("Logout");

    // Navigate user to search user page.
   const searchUserHandler = async (event) => {
        event.preventDefault();
        nav('/searchuser');
   }

   const chatHandler = async (event) => {
        event.preventDefault();
        nav('/chat');
   }
   
    // Navigate user to language development activities page.
    const redirectToActivities = async (event) => {
        event.preventDefault();
        nav("/activities");
    }

    // Navigate user to login page if the token is not set or otherwise invalid.
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }
    }, []);

    // Handle logout; clear session and navigate user to login page.
    const clearSession = async (event) => {
        sessionStorage.clear();
        nav("/");
    }

    // State variable for check if the page has been translated.
    const [translated, setTranslated] = useState(0);
    
    // Translate messages and set it to state variables.
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang && dashboard !== undefined) {
            Translate('en', lang, dashboard).then(response => setDashboard(response));
            Translate('en', lang, "Home").then(response => setHome(response));
            Translate('en', lang, "Profile").then(response => setProfile(response));
            Translate('en', lang, "Chat").then(response => setChatMsg(response));
            Translate('en', lang, "Manage Schools").then(response => setManageSchools(response));
            Translate('en', lang, "Manage Users").then(response => setManageUsers(response));
            Translate('en', lang, "Search Users").then(response => setSearchUsers(response));
            Translate('en', lang, "Group Manager").then(response => setGroupManagerMsg(response));
            Translate('en', lang, "Language Learning Activities").then(response => setLanguageLearningActivitiesMsg(response));
            Translate('en', lang, "Logout").then(response => setLogoutMsg(response));
        }
    });

    // ???
    function dash_render(props) {
        const home = props.home;
        if (home) {
            return (
                <Card style={{marginTop:"10px", position:"relative", left:"0%", backgroundColor:"white", width:"80%"}}>
                    <Card.Body>
                        <Card.Title>Profile</Card.Title>
    
                        <Card.Text>
                            <p>Username: {sessionStorage.getItem('username')}</p>
                            <p>Email: {sessionStorage.getItem('email')}</p>
                            <p>Language: {sessionStorage.getItem('language')}</p>
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        } else {
            return (
                <Card style={{marginTop:"10px", position:"relative", left:"0%", backgroundColor:"white", width:"80%"}}></Card>
            );
        }
    };

    // Run on the page load; translate page, and handle translate request when new language is set.
    useEffect(() => {
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }
        
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    }, [dashboard]);

    // if (userType === 4) {
    //     return ();
    // }

    return (
        <div className="dashboard-wrapper">
            <Card style={{minHeight:"fit-content", paddingBottom:"20px"}}>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <Navbar bg="light" expand="lg" style={{width:"94%", margin: "20px 0px 10px 0px"}}>
                    <Container>
                        <Navbar.Brand style={{fontWeight:"bold",fontSize:"30px",margin:"10px 50px 10px 20px"}}>{dashboardString}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <img src={home_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="#home" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{home}</Nav.Link>
                            <img src={user_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="userinfoadmin" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px", border:""}}>{profile}</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    <Button variant="primary" type="submit" id="chat" onClick={chatHandler} style={{minWidth:"150px"}}>{chat}</Button>  
                    <div>{userType === 4 ? <Button variant="primary" type="submit" id="manageSchools" style={{minWidth:"150px"}}>{manageSchools}</Button> : null}</div>
                    <div>{userType > 1 ? <Button variant="primary" type="submit" id="searchUsers" onClick = {searchUserHandler}style={{minWidth:"150px"}}>{searchUsers}</Button> : null}</div>
                    <div>{userType === 4 ? <Button href="/usermanager" variant="primary" type="submit" id="manageUsers" style={{minWidth:"150px"}}>{manageUsers}</Button> : null}</div>
                    <div>{userType !== 1 ? <Button href="/groupmanager" variant="primary" type="submit" id="groups" style={{minWidth:"150px"}}>{group_manager}</Button> : null}</div>  
                    <Button variant="secondary" type="submit" id="activities" onClick={redirectToActivities} style={{minWidth:"150px"}}>{activities}</Button>
                    <Button variant="danger" type="submit" id="logout" onClick={clearSession} style={{minWidth:"150px"}}>{logout_msg}</Button>
                </Card>
            </Card>
        </div>
    );
}