import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from 'react-bootstrap';

import logo from "../Img/lingrow.png";
import './Login.css';

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

export default function Login() {
    const nav = useNavigate();
    const[email, setEmail] = useState();
    const[password, setPassWord] = useState();
    const[error, setError] = useState(false);


    const handleSubmit = async (event) =>{
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

    const redirectToSignup = async (event) => {
        event.preventDefault();
        nav("/signup");
    }

    const errorMessage = () => {
        return (
            <div className="error" style={{
            display: error ? '' : 'none',
            }}>
                Invalid email or password
            </div>
        );
    };

    return (
        <Card>
            <img src={logo} className="logo" alt="logo" />
            <h1>LinGrow Login</h1>
            <label className="label">Email address</label>
            <input type="text" class="form-control" id="name" placeholder="Enter Email Address" onChange={e => setEmail(e.target.value)}/>
            <label className="label">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Enter Password" onChange={e => setPassWord(e.target.value)}/>
            <div className="message">
                {errorMessage()}
            </div>
            <Button variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
            <Button variant="primary" type="submit" onClick={redirectToSignup}>Sign Up</Button>
            <a href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj">Kitchen Activities</a>
            <a href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ">Bath Time!</a>
        </Card>
    )
}