import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card, Button, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";

export default function DashboardResearcher() {
    const nav = useNavigate();

    const [dashboard, setDashboard] = useState("LinGrow Researcher Dashboard");
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [chat, setChatMsg] = useState("Chat");
    const [searchParents, setSearchParents] = useState("Search Parents");
    const [parentGroups, setParentGroups] = useState("Parent Groups");
    const [searchTeachers, setSearchTeachers] = useState("Search Teachers");
    const [teacherGroups, setTeacherGroups] = useState("Teachers Groups");
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
        nav("/");
    }

    const [translated, setTranslated] = useState(0);
    
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Researcher Dashboard").then(response => setDashboard(response));
            Translate('en', lang, "Home").then(response => setHome(response));
            Translate('en', lang, "Profile").then(response => setProfile(response));
            Translate('en', lang, "Chat").then(response => setChatMsg(response));
            Translate('en', lang, "Search Parents").then(response => setSearchParents(response));
            Translate('en', lang, "Parent Groups").then(response => setParentGroups(response));
            Translate('en', lang, "Search Teachers").then(response => setSearchTeachers(response));
            Translate('en', lang, "Teachers Groups").then(response => setTeacherGroups(response));
            Translate('en', lang, "Language Learning Activities").then(response => setLanguageLearningActivitiesMsg(response));
            Translate('en', lang, "Logout").then(response => setLogoutMsg(response));

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
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }
        
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <div className="dashboard-wrapper">
            <Card style={{minHeight:"fit-content", paddingBottom:"20px"}}>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="responsive image" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <Navbar bg="light" expand="lg" style={{width:"94%", margin:"20px 0px 10px 0px"}}>
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
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    <Button variant="primary" type="submit" id="chat" style={{minWidth:"150px"}}>{chat}</Button>  
                    <Button variant="primary" type="submit" id="searchParents" style={{minWidth:"150px"}}>{searchParents}</Button>  
                    <Button variant="primary" type="submit" id="parentGroups" style={{minWidth:"150px"}}>{parentGroups}</Button>  
                    <Button variant="primary" type="submit" id="searchTeachers" style={{minWidth:"150px"}}>{searchTeachers}</Button>  
                    <Button variant="primary" type="submit" id="teacherGroups" style={{minWidth:"150px"}}>{teacherGroups}</Button>  
                    <Button variant="secondary" type="submit" id="activities" onClick={redirectToActivities} style={{minWidth:"150px"}}>{activities}</Button>
                    <Button variant="danger" type="submit" id="logout" onClick={clearSession} style={{minWidth:"150px"}}>{logout_msg}</Button>
                </Card>
            </Card>
        </div>
    );
}