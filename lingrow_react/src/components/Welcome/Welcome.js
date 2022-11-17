import React, { useState, useEffect, useCallback }from 'react';
import { Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import './Welcome.css';

export default function Welcome() {

    let [welcome_msg, setWelcome] = useState("Hello!");
    let [link_msg, setLink] = useState("Login to LinGrow");

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.reload();
    }

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        if (localStorage.getItem('lang')) {
            Translate('en', localStorage.getItem('lang'), "Hello!").then(response => setWelcome(response));
            Translate('en', localStorage.getItem('lang'), "Login to LinGrow").then(response => setLink(response));
        }
        else {
            localStorage.setItem('lang', 'en');
        }
    });

    useEffect(() => {
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <Card style={{top:"40%", width:"20%", left:"40%", right:"40%", height:"20%", minWidth:"fit-content", minHeight:"fit-content"}}>
            <LanguageList />
            <h2 id="welcome_msg">{welcome_msg}</h2>
            <a href="" id="welcome_link" onClick={handleSubmit}>{link_msg}</a>
        </Card>
    );
}