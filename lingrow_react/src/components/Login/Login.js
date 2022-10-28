import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Button, Card} from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import logo from "../Img/lingrow.png";
import './Login.css';

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

        if (sessionStorage.getItem('token').includes("error")) {
            setError(true);
            console.log("Validation failed");
        }
        else {
            setError(false);
            console.log("Valid credentials");
            nav("/dashboard");
        }
    }

    async function loginUser(credentials) {
        console.log(JSON.stringify(credentials));
        return fetch('http://127.0.0.1:8000/api/user/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(data => data.json())
    }

    const redirectToSignup = async (event) => {
        sessionStorage.clear();
        sessionStorage.setItem('redirect', "success");
        event.preventDefault();
        nav("/signup");
    }
    const redirectToActivities = async (event) => {
        sessionStorage.clear();
        sessionStorage.setItem('redirect', "success");
        event.preventDefault();
        nav("/activities");
    }

    const errorMessage = () => {
        return (
            <div className="error" data-testid="errormessage" style={{
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
            Translate(lang, "LinGrow Login").then(response => setHeader(response));
            Translate(lang, "Email address").then(response => setEmailMsg(response));
            Translate(lang, "Password").then(response => setPassMsg(response));
            Translate(lang, "Login").then(response => setLoginBtn(response));
            Translate(lang, "Signup").then(response => setSignupBtn(response));
            Translate(lang, "Invalid email or password").then(response => setErrorMsg(response));
            Translate(lang, "Language Learning Activities").then(response => setActivity(response));
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
        <Card style={{minHeight:"fit-content"}}>
            <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="responsive image" style={{marginTop:"20px"}}/></a>
            <LanguageList />
            <h1>{header}</h1>
            <label className="label">{email_msg}</label>
            <input type="text" className="form-control" data-testid="email" placeholder={"lingrow@email.com"} onChange={e => setEmail(e.target.value)}/>
            <label className="label">{pass_msg}</label>
            <input type="password" className="form-control" data-testid="password" placeholder={pass_msg} onChange={e => setPassWord(e.target.value)}/>
            <div className="message">
                {errorMessage()}
            </div>
            <Button variant="primary" type="submit" data-testid="login" onClick={handleSubmit}>{login_btn}</Button>
            <Button variant="primary" type="submit" data-testid="signup" onClick={redirectToSignup}>{signup_btn}</Button>
            <Button variant="primary" type="submit" data-testid="forgot" onClick={redirectToActivities}>{activities}</Button>
        </Card>
    )
}