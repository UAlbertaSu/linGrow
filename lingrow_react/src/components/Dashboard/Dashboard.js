import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card, Button} from 'react-bootstrap';
import {Helmet} from 'react-helmet';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import DashNav from '../DashNav/DashNav';
import logo from "../Img/blank_lingrow.png";



// A dashboard page that acts as the main navigation page for all users, 
// what is displayed is dependent on which user type is logged in.

export default function Dashboard({ userType }) {
    const nav = useNavigate();

    // State variables.
    const [tab_header, setTabHeader] = useState("LinGrow Home");
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
        if (lang) {
            Translate('en', lang, "LinGrow Home").then((response) => setTabHeader(response));
            Translate('en', lang, "Chat").then(response => setChatMsg(response));
            Translate('en', lang, "Manage Schools").then(response => setManageSchools(response));
            Translate('en', lang, "Manage Users").then(response => setManageUsers(response));
            Translate('en', lang, "Search Users").then(response => setSearchUsers(response));
            Translate('en', lang, "Group Manager").then(response => setGroupManagerMsg(response));
            Translate('en', lang, "Language Learning Activities").then(response => setLanguageLearningActivitiesMsg(response));
            Translate('en', lang, "Logout").then(response => setLogoutMsg(response));
        }
    });

    // Run on the page load; translate page, and handle translate request when new language is set.
    useEffect(() => {
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }
        
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    }, []);


    // homepage with variables to display different content depending on user type.
    return (
        <div className="bg">
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <Helmet>
                        <meta charSet="utf-8" />
                        <title>{tab_header}</title>
                </Helmet>
                <a href="https://bilingualacquisition.ca/"></a>
                <LanguageList />
                <DashNav/>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    <Button href="chat" variant="primary" type="submit" id="chat" style={{minWidth:"150px"}}>{chat}</Button>  
                    <div>{userType === 4 ? <Button href="/schoolmanager" variant="primary" type="submit" id="manageSchools" style={{minWidth:"150px"}}>{manageSchools}</Button> : null}</div>
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