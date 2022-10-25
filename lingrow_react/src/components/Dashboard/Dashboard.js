import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

export default function Dashboard() {
    const nav = useNavigate();

    const [dashboard, setDashboard] = useState("Welcome to LinGrow dashboard");
    const [logout_msg, setLogoutMsg] = useState("Logout");

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }
    }, []);

    const clearSession = async (event) => {
        sessionStorage.clear();
        sessionStorage.setItem('redirect', "success");
        nav("/");
    }
    
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate(lang, "Welcome to LinGrow dashboard").then(response => setDashboard(response));
            Translate(lang, "Logout").then(response => setLogoutMsg(response));
        }
    });

    useEffect(() => {
        translateMessage();
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <div className="dashboard-wrapper">
            <Card>
                <LanguageList />
                <h2>{dashboard}</h2>
                <button onClick={clearSession} data-testid='logout'>{logout_msg}</button>
                <a href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj">Kitchen Activities</a>
                <a href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ">Bath Time!</a>
            </Card>
        </div>
    );
}