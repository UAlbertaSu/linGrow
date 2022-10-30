import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card, Button, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";

export default function Dashboard() {
    const nav = useNavigate();

    const [dashboard, setDashboard] = useState("LinGrow Admin Dashboard");
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [chat, setChatMsg] = useState("Chat");
    const [manageSchools, setManageSchools] = useState("Manage Schools");
    const [manageUsers, setManageUsers] = useState("Manage Users");
    const [searchUsers, setSearchUsers] = useState("Search Users");
    const [groups, setGroups] = useState("Groups");
    const [activities, setLanguageLearningActivitiesMsg] = useState("Language Learning Activities");
    const [logout_msg, setLogoutMsg] = useState("Logout");

    const redirectToActivities = async (event) => {
        event.preventDefault();
        nav("/activities");
    }
    
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }
    }, []);

    const clearSession = async (event) => {
        sessionStorage.clear();
        sessionStorage.setItem('redirect', "success");
        nav("/");
    }

    const [translated, setTranslated] = useState(0);
    
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate(lang, "LinGrow Admin Dashboard").then(response => setDashboard(response));
            Translate(lang, "Home").then(response => setHome(response));
            Translate(lang, "Profile").then(response => setProfile(response));
            Translate(lang, "Chat").then(response => setChatMsg(response));
            Translate(lang, "Manage Schools").then(response => setManageSchools(response));
            Translate(lang, "Manage Users").then(response => setManageUsers(response));
            Translate(lang, "Search Users").then(response => setSearchUsers(response));
            Translate(lang, "Groups").then(response => setGroups(response));
            Translate(lang, "Language Learning Activities").then(response => setLanguageLearningActivitiesMsg(response));
            Translate(lang, "Logout").then(response => setLogoutMsg(response));

        }
    });

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

    useEffect(() => {
        translateMessage();
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <div className="dashboard-wrapper">
            <Card style={{height:"120%"}}>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="responsive image" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <Navbar bg="light" expand="lg" style={{width:"90%", margin:"35px"}}>
                    <Container>
                        <Navbar.Brand style={{fontWeight:"bold",fontSize:"30px",margin:"10px 50px 10px 20px"}}>{dashboard}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <img src={home_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="#home" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{home}</Nav.Link>
                            <img src={user_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="#profile" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px", border:""}}>{profile}</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Button variant="secondary" type="submit" id="chat" style={{margin:"35px"}}>{chat}</Button>  
                <Button variant="secondary" type="submit" id="manageSchools">{manageSchools}</Button>  
                <Button variant="secondary" type="submit" id="manageUsers">{manageUsers}</Button>  
                <Button variant="secondary" type="submit" id="searchUsers">{searchUsers}</Button>  
                <Button variant="secondary" type="submit" id="groups">{groups}</Button>  
                <Button variant="secondary" type="submit" id="activities" onClick={redirectToActivities}>{activities}</Button>
                <Button variant="secondary" type="submit" id="logout" onClick={clearSession}>{logout_msg}</Button>
            </Card>
        </div>
    );
}