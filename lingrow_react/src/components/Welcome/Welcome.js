import React, { useState, useEffect, useCallback }from 'react';
import { Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

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
        <Card>
            <LanguageList />
            <h2>{welcome_msg}</h2>
            <a href="" data-testid="welcome_link" onClick={handleSubmit}>{link_msg}</a>
        </Card>
    );
}