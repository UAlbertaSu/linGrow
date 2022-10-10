import React, { useState } from 'react';
import PropTypes from 'prop-types';

import logo from "../Img/lingrow.png";
import './Login.css';

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

export default function Login({ setToken }) {

    const[username, setUserName] = useState();
    const[password, setPassWord] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token);
    }

    return (
        <div className="login-wrapper">
            <img src={logo} className="logo" alt="logo" />
            <h1>linGrow Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassWord(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                    <button onClick={handleSubmit} type="signup">Signup</button>
                </div>
            </form>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};