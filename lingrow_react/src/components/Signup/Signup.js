import React, { useState, useCallback, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {Helmet} from 'react-helmet';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import './Signup.css';
import 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'


//Allows the user to sign up, upon successful, should redirect to login page. 


export default function Form() {

    const nav = useNavigate();

    //translation states
    const [tab_header, setTabHeader] = useState("LinGrow Signup");
    const [header, setHeader] = useState("Parent Registration");
    const [email_msg, setEmailMsg] = useState("Email address");
    const [enter_email_msg, setEnterEmailMsg] = useState("Enter Email Address");
    const [first_msg, setFirstMsg] = useState("First name");
    const [enter_first_msg, setEnterFirstMsg] = useState("Enter First Name");
    const [middle_msg, setMiddleMsg] = useState("Middle name");
    const [enter_middle_msg, setEnterMiddleMsg] = useState("Enter Middle Name");
    const [last_msg, setLastMsg] = useState("Last name");
    const [enter_last_msg, setEnterLastMsg] = useState("Enter Last Name");
    const [pass_msg, setPasswordMsg] = useState("Password");
    const [enter_pass_msg, setEnterPasswordMsg] = useState("Enter password");
    const [confirm_msg, setConfirmPasswordMsg] = useState("Confirm password");
    const [enter_confirm_msg, setEnterConfirmPasswordMsg] = useState("Enter password again");
    const [child_msg, setChildMsg] = useState("Child's Name*");
    const [enter_child_msg, setEnterChildMsg] = useState("Enter Child's Name");
    const [error_msg, setErrorMsg] = useState("Registration failed");
    const [require_msg, setRequiredMsg] = useState("Field with * must be filled out");
    const [register_btn, setRegisterBtn] = useState("Register");


    async function signupUser(credentials) {
        console.log(credentials);
        return fetch('http://127.0.0.1:8000/api/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(data => {
            console.log(data);
            if (data['status'] === 201) {
                setSubmitted(true);
                setError(false);
                nav("/login");
            }
            else {
                setSubmitted(false);
                setError(true);
            }
        })
    }

    // States for registration
    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [user_type, setUserType] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [child_name, setChildName] = useState('');
    const [middle_name, setMiddleName] = useState('');

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the parameter changes
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };
    
    const handleFirstName = (e) => {
        setFirstName(e.target.value);
        setSubmitted(false);
    };
    
    const handleLastName = (e) => {
        setLastName(e.target.value);
        setSubmitted(false);
    };
    
    
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };
    
    const handleConfirmPassword = (e) => {
        setPassword2(e.target.value);
        setSubmitted(false);
    };

    const handleChildName = (e) => {
        setChildName(e.target.value);
        setSubmitted(false);
    };

    const handleMiddleName = (e) => {
        setMiddleName(e.target.value);
        setSubmitted(false);
    };

    // Handling the form submission
    const handleSubmit = (e) => {

        e.preventDefault();
        if (email === '' || first_name === '' || last_name === '' || user_type === '' || password === '' || password2 === '') {
            setError(true);
        }
        else if (password !== password2) {
            setError(true);
        }
        else if (user_type === '1' && child_name === '') {
            setError(true);
        }
        else {
            e.preventDefault();
            signupUser({
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "user_type": 1,
                "password": password,
                "password2": password2,
                "child_name": child_name,
                "middle_name": middle_name
            });

            // // TODO: Would be nice to have a timed redirect to dashboard, rather than immediate redirect.
            // nav("/dashboard");
        }
    };

    const [translated, setTranslated] = useState(0);

    // Showing success message
    const successMessage = () => {
        return (
            <div className="success" style={{
                display: submitted ? '' : 'none',
            }}>
                Welcome to linGrow {first_name} {last_name}!
            </div>
        );
    };

    const translateMessage = useCallback(() => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, 'LinGrow Signup').then((res) => setTabHeader(res));
            Translate('en', lang, "Parent Registration").then(response => setHeader(response));
            Translate('en', lang, "Email address*").then(response => setEmailMsg(response));
            Translate('en', lang, "Enter Email Address").then(response => setEnterEmailMsg(response));
            Translate('en', lang, "First name*").then(response => setFirstMsg(response));
            Translate('en', lang, "Enter First Name").then(response => setEnterFirstMsg(response));
            Translate('en', lang, "Middle name").then(response => setMiddleMsg(response));
            Translate('en', lang, "Enter Middle Name").then(response => setEnterMiddleMsg(response));
            Translate('en', lang, "Last name*").then(response => setLastMsg(response));
            Translate('en', lang, "Enter Last Name").then(response => setEnterLastMsg(response));
            Translate('en', lang, "Password*").then(response => setPasswordMsg(response));
            Translate('en', lang, "Enter Password").then(response => setEnterPasswordMsg(response));
            Translate('en', lang, "Confirm password*").then(response => setConfirmPasswordMsg(response));
            Translate('en', lang, "Enter password again").then(response => setEnterConfirmPasswordMsg(response));
            Translate('en', lang, "Child's Name*").then(response => setChildMsg(response));
            Translate('en', lang, "Enter Child's Name").then(response => setEnterChildMsg(response));
            Translate('en', lang, "Error").then(response => setErrorMsg(response));
            Translate('en', lang, "Field with * is required").then(response => setRequiredMsg(response));
            Translate('en', lang, "Register").then(response => setRegisterBtn(response));
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

    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div className="error" id="errormessage" style={{
            display: error ? '' : 'none',
            }}>
                {error_msg}
            </div>
        );
    };
    // self signup page for parents
    return (
        <div className="bg">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{tab_header}</title>
            </Helmet>
            <Card className="signup" style={{}}>
                        <LanguageList />
                        <h1>{header}</h1>
                            {/* Labels and inputs for form data */}
                        <label className="label">{email_msg}</label>
                        <input className="form-control" type="text" id="email" placeholder={enter_email_msg} value={email} onChange={handleEmail} />
                        <label className="label">{first_msg}</label>
                        <input className="form-control" type="text" id="first_name" placeholder={enter_first_msg} value={first_name} onChange={handleFirstName} />
                        <label className="label">{middle_msg}</label>
                        <input className="form-control" type="text" id="middle_name" placeholder={enter_middle_msg} value={middle_name} onChange={handleMiddleName} />
                        <label className="label">{last_msg}</label>
                        <input className="form-control" type="text" id="last_name" placeholder={enter_last_msg} value={last_name} onChange={handleLastName} />
                        <label className="label">{pass_msg}</label>
                        <input className="form-control" type="password" id="password1" placeholder={enter_pass_msg} value={password} onChange={handlePassword} />
                        <label className="label">{confirm_msg}</label>
                        <input className="form-control" type="password" id="password2" placeholder={enter_confirm_msg} value={password2} onChange={handleConfirmPassword} />
                        <label className="label">{child_msg}</label>
                        <input className="form-control" type="text" id="child_name" placeholder={enter_child_msg} value={child_name} onChange={handleChildName} />
                        <label classname="label" style={{fontWeight:"Bold"}}>{require_msg}</label>
                        <div className="message">
                            {errorMessage()}
                            {successMessage()}
                        </div>
                        <Button variant="primary" type="submit" id="submit_button" onClick={handleSubmit}>{register_btn}</Button>{''}
            </Card>
        </div>
    );
}