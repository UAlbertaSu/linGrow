import React, { useState, useEffect, useCallback } from 'react';
import { Card,  Col, Row, } from 'react-bootstrap';
import {  useLocation } from "react-router-dom";

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';


import { Helmet } from 'react-helmet';
import logo from "../Img/lingrow.png";
import DashNav from '../DashNav/DashNav';

// Allows users to view the information of another user. 
// This page is only accessible to users who are logged in and have searched for the user from User Search
function UserProfile() {

    let location = useLocation();

    const [userType, setUserType] = useState(JSON.parse(sessionStorage.getItem('userType')));
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    
    // headers
    const [tab_header, setTabHeader] = useState("Lingrow User Info");
    const [username_email_header, setUsernameEmailHeader] = useState("Username/Email");
    const [name_header, setNameHeader] = useState("First Name");
    const [last_name_header, setLastNameHeader] = useState("Last Name");
    const [childs_name_header, setChildsNameHeader] = useState("Child's Name");
    
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [otherUserType, setOtherUserType] = useState("");
    const [childName, setChildName] = useState("");
    const [done, setDone] = useState(0);
    
    let userId = location.state.userId;
    userId = userId+'/'
    
    if (userType === 4){
        // Only Admins can fetch from the specific endpoint
        fetch(
            `http://127.0.0.1:8000/api/user/profile/${userId}`, {
    
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            }).then(data => data.json()
            ).then(data => {
                console.log(data);
                setFirstName(data.user.first_name);
                setLastName(data.user.last_name);
                setEmail(data.user.email);
                setOtherUserType(data.user.user_type);
                setChildName(data.user.child_name)
            }).then(() => {
                setDone(1);
            });
    }
    else{
        // Admins no not have authorization to use this endpoint
        fetch(
            `http://127.0.0.1:8000/api/user/get-user/${userId}`, {

            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            }).then(data => data.json()
            ).then(data => {
                console.log(data);
                setFirstName(data.user.first_name);
                setLastName(data.user.last_name);
                setEmail(data.user.email);
                setOtherUserType(data.user.user_type);
                setChildName(data.user.child_name)
            }).then(() => {
                setDone(1);
            });
    }

        const [translated, setTranslated] = useState(0);

        const translateMessage = useCallback((e) => {
            let lang = localStorage.getItem('lang');
            if (lang) {
                Translate('en', lang, "Lingrow User Info").then((response) => setTabHeader(response));
                Translate('en', lang, "Username/Email").then(response => setUsernameEmailHeader(response));
                Translate('en', lang, "First Name").then(response => setNameHeader(response));
                Translate('en', lang, "Last Name").then(response => setLastNameHeader(response));
                Translate('en', lang, "Child's Name").then(response => setChildsNameHeader(response));
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
    

  
    return(
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
                            <Card.Title style={{margin:"15px 10px 10px 10px", fontWeight:"bold"}}>{username_email_header} : {email}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{name_header} : {FirstName}</Card.Title>
                            <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{last_name_header} : {LastName}</Card.Title>
                            <div>{otherUserType === 1 ? <Card.Title style={{margin:"20px 10px 10px 10px", fontWeight:"bold"}}>{childs_name_header}</Card.Title> : null}</div>
                            
                            
                        </Col>
                        {/* <Col className="info_col" >
                            <div> <Card.Title style={{margin:"10px"}}>{email}</Card.Title> </div>
                            <div> <Card.Title style={{margin:"10px"}}>{FirstName}</Card.Title> </div>
                            <div> <Card.Title style={{margin:"10px"}}>{LastName}</Card.Title> </div>
                            <div>{otherUserType === 1 ? <Card.Title style={{margin:"10px"}}>{childName}</Card.Title>  : null}</div>
                        </Col> */}
                    </Row>
                </Card>
            </Card>
        </div>


    );
}

export default UserProfile;