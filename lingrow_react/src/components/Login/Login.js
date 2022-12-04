import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Button, Card} from 'react-bootstrap';
import {Helmet} from 'react-helmet';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import Authenticate from '../Authenticate/Authenticate';

import logo from "../Img/lingrow.png";
import './Login.css';


// Allows users to login with valid credentials.
// should be able to redirect to signup page if user doesn't have an account.


export async function retrieveUserType(token) {
    return fetch('http://127.0.0.1:8000/api/user/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(data => data.json()
    ).then(data => {
        if (data.hasOwnProperty('error')) {
            throw Error("Failed to retrieve user due to invalid login credentials or database request error.");
        }
        else {
            return data;
        }
    });
}

export default function Login() {
    const nav = useNavigate();

    const [email, setEmail] = useState();
    const [password, setPassWord] = useState();
    const [error, setError] = useState(false);

    const [header, setHeader] = useState("LinGrow Login");
    const [email_msg, setEmailMsg] = useState("Email address");
    const [pass_msg, setPassMsg] = useState("Password");
    const [login_btn, setLoginBtn] = useState("Login");
    const [signup_btn, setSignupBtn] = useState("Signup");
    const [error_msg, setErrorMsg] = useState("Invalid email or password");
    const [activities, setActivity] = useState("Language Learning Activities");

    async function handleSubmit(event) {
        event.preventDefault();
        const token = await loginUser({
            "email": email,
            "password": password
        });
        sessionStorage.setItem('token', JSON.stringify(token));

        Authenticate(token).then(response => {
            setError(false);
            sessionStorage.setItem('userType', response.user.user_type);
            nav("/dashboard");
        }).catch(error => {
            setError(true);
            console.log("Validation failed: ", error);
        });
    }
    
    async function loginUser(credentials) {
        return fetch('http://127.0.0.1:8000/api/user/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(data => data.json()
        ).then(data => {
            return data.token.access;
        }).catch(error => {
            console.log(error);
        });
    }

    const redirectToSignup = async (event) => {
        event.preventDefault();
        nav("/signup");
    }
    const redirectToActivities = async (event) => {
        event.preventDefault();
        nav("/activities");
    }

    const errorMessage = () => {
        return (
            <div className="error" id="errormessage" style={{
            display: error ? '' : 'none',
            }}>
                {error_msg}
            </div>
        );
    };

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Login").then(response => setHeader(response));
            Translate('en', lang, "Email address").then(response => setEmailMsg(response));
            Translate('en', lang, "Password").then(response => setPassMsg(response));
            Translate('en', lang, "Login").then(response => setLoginBtn(response));
            Translate('en', lang, "Signup").then(response => setSignupBtn(response));
            Translate('en', lang, "Invalid email or password").then(response => setErrorMsg(response));
            Translate('en', lang, "Language Learning Activities").then(response => setActivity(response));
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

    return (
        <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>linGrow-Login</title>
                </Helmet>
                <Card>
                <a href="https://bilingualacquisition.ca/"><img src={logo} class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px"}}/></a>
                <LanguageList />
                <h1>{header}</h1>
                <label className="label">{email_msg}</label>
                <input type="text" className="form-control" id="email" placeholder={"lingrow@email.com"} onChange={e => setEmail(e.target.value)}/>
                <label className="label">{pass_msg}</label>
                <input type="password" className="form-control" id="password" placeholder={pass_msg} onChange={e => setPassWord(e.target.value)}/>
                <div className="message">
                    {errorMessage()}
                </div>
                <Button variant="primary" type="submit" id="login" onClick={handleSubmit} style={{minWidth:"100px"}}>{login_btn}</Button>
                <Button variant="primary" type="submit" id="signup" onClick={redirectToSignup} style={{minWidth:"100px"}}>{signup_btn}</Button>
                <Button variant="secondary" type="submit" id="activities" onClick={redirectToActivities} style={{margin:"35px"}}>{activities}</Button>
            </Card>
        </div>
    )
}