import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card, Button, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home from "../Img/home_icon.png";

export default function Dashboard() {
    const nav = useNavigate();

    const [dashboard, setDashboard] = useState("LinGrow Dashboard");
    const [logout_msg, setLogoutMsg] = useState("Logout");

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
    
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate(lang, "LinGrow Dashboard").then(response => setDashboard(response));
            Translate(lang, "Logout").then(response => setLogoutMsg(response));
        }
    });

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
                <Navbar bg="light" expand="lg" style={{width:"90%"}}>
                    <Container >
                        <Navbar.Brand href="#home">{dashboard}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#profile">Profile</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
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
                <Button variant="secondary" type="submit" data-testid="logout" onClick={clearSession}>{logout_msg}</Button>
            </Card>
        </div>
    );
}