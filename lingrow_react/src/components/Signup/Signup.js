import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import LanguageList from '../Translate/LanguageList';

import './Signup.css';
import 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

export default function Form() {

    const nav = useNavigate();

    async function signupUser(credentials) {
        console.log(credentials);
        sessionStorage.clear();
        sessionStorage.setItem('registration', "success");
        return fetch('http://127.0.0.1:8000/api/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(data => {
            console.log(data);
            if (data['status'] === 201) {
                sessionStorage.clear();
                sessionStorage.setItem('registration', "success");
                setSubmitted(true);
                setError(false);
                nav("/login");
            }
            else {
                sessionStorage.clear();
                sessionStorage.setItem('registration', "failed");
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
    
    const handleUserType = (e) => {
        setUserType(e.target.value);
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
            sessionStorage.clear();
            sessionStorage.setItem('registration', "failed");
        }
        else if (password !== password2) {
            setError(true);
            sessionStorage.clear();
            sessionStorage.setItem('registration', "failed");
        }
        else if (user_type === '1' && child_name === '') {
            setError(true);
            sessionStorage.clear();
            sessionStorage.setItem('registration', "failed");
        }
        else {
            e.preventDefault();
            signupUser({
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "user_type": user_type,
                "password": password,
                "password2": password2,
                "child_name": child_name,
                "middle_name": middle_name
            });

            // // TODO: Would be nice to have a timed redirect to dashboard, rather than immediate redirect.
            // nav("/dashboard");
        }
    };

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

    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div className="error" style={{
            display: error ? '' : 'none',
            }}>
                Registration failed
            </div>
        );
    };

    return (
        <Card style={{ width: '18rem', width:"20%", top:"5%", left:"40%", minWidth:"fit-content"}}>
                    <LanguageList />
                    <h1>User Registration</h1>
                        {/* Labels and inputs for form data */}
                    <label className="label">Email address*</label>
                    <input className="form-control" type="text" data-testid="email" placeholder="Enter Email Address" value={email} onChange={handleEmail} />
                    <label className="label">First name*</label>
                    <input className="form-control" type="text" data-testid="first_name" placeholder="Enter First Name" value={first_name} onChange={handleFirstName} />
                    <label className="label">Middle name</label>
                    <input className="form-control" type="text" data-testid="middle_name" placeholder="Enter Middle Name" value={middle_name} onChange={handleMiddleName} />
                    <label className="label">Last name*</label>
                    <input className="form-control" type="text" data-testid="last_name" placeholder="Enter Last Name" value={last_name} onChange={handleLastName} />
                    <label className="label">User type*</label>
                    <select className="form-select" value={user_type} data-testid="user_type" onChange={handleUserType}>
                        <option value="0">Please Select User Type</option>
                        <option value="1">Parent</option>
                        <option value="2">Teacher</option>
                        <option value="3">Researcher</option>
                        <option value="4">Admin</option>
                    </select>
                    <label className="label">Password*</label>
                    <input className="form-control" type="password" data-testid="password" placeholder="Enter Password" value={password} onChange={handlePassword} />
                    <label className="label">Confirm password*</label>
                    <input className="form-control" type="password" data-testid="password2" placeholder="Confirm Password" value={password2} onChange={handleConfirmPassword} />
                    <label className="label">Child name(* if parent)</label>
                    <input className="form-control" type="text" data-testid="child_name" placeholder="Enter Child Name" value={child_name} onChange={handleChildName} />
                    <label classname="label" >Field with * must be filled out.</label>
                    <div className="message">
                        {errorMessage()}
                        {successMessage()}
                    </div>

                    
                    <Button variant="primary" type="submit" data-testid="submit_button" onClick={handleSubmit}>Submit</Button>{''}
        </Card>
    );
}