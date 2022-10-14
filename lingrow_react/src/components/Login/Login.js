import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Form, Button, Card } from 'react-bootstrap';

import logo from "../Img/lingrow.png";
import './Login.css';
import useToken from '../App/useToken.js';

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Login() {
    const nav = useNavigate();
    const{token, setToken} = useToken();
    const[username, setUserName] = useState();
    const[password, setPassWord] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token);
        nav("/dashboard");
    }

    const redirectToSignup = async (event) => {
        event.preventDefault();
        nav("/signup");
    }

    return (
        <Card>
            <img src={logo} className="logo" alt="logo" />
            <h1>LinGrow Login</h1>
            <label className="label">Name</label>
            <input type="text" class="form-control" id="name" placeholder="Enter name" onChange={e => setUserName(e.target.value)}/>
            <label className="label">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Enter Password" onChange={e => setPassWord(e.target.value)}/>
            <Button variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
            <Button variant="primary" type="submit" onClick={redirectToSignup}>Sign Up</Button>
        </Card>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};