import React, { useState, useEffect, useCallback }from 'react';
import { Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import './Welcome.css';

export default function Welcome() {

    let [welcome_msg, setWelcome] = useState("Welcome!");
    let [link_msg, setLink] = useState("Login to LinGrow");

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.reload();
    }

    const translateMessage = useCallback((e) => {
        if (localStorage.getItem('lang')) {
            Translate(localStorage.getItem('lang'), "Welcome!").then(response => setWelcome(response));
            Translate(localStorage.getItem('lang'), "Login to LinGrow").then(response => setLink(response));
        }
    });

    useEffect(() => {
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <Card style={{top:"40%", width:"20%", left:"40%", right:"40%", height:"20%", minWidth:"fit-content", minHeight:"fit-content"}}>
            <LanguageList />
            <h2>{welcome_msg}</h2>
            <a href="" data-testid="welcome_link" onClick={handleSubmit}>{link_msg}</a>
        </Card>
    );
}