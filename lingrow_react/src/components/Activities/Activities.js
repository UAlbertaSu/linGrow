import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import logo from "../Img/lingrow.png";
import './Activities.css';

export default function Activities() {
    const nav = useNavigate();
    const [header, setHeader] = useState("Language Learning Activities");
    const [activity1, setActivity1] = useState("Kitchen Activities");
    const [activity2, setActivity2] = useState("Bath Activities");

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate(lang, "Language Learning Activities").then(response => setHeader(response));
            Translate(lang, "Kitchen Activities").then(response => setActivity1(response));
            Translate(lang, "Bath Activities").then(response => setActivity2(response));
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
        <Card style={{height:"110%"}}>
            <LanguageList />
            <h1>{header}</h1>
            <a href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj">{activity1}</a>
            <a href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ">{activity2}</a>
        </Card>
    )
}