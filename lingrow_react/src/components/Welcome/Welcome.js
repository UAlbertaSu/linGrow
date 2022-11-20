import React, { useState, useEffect, useCallback }from 'react';
import { Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import './Welcome.css';

export default function Welcome() {

    let [welcome_msg, setWelcome] = useState("Welcome!");
    let [link_msg, setLink] = useState("Enter Website");

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.reload();
    }

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        if (localStorage.getItem('lang')) {
            Translate('en', localStorage.getItem('lang'), "Welcome!").then(response => setWelcome(response));
            Translate('en', localStorage.getItem('lang'), "Enter Website").then(response => setLink(response));
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
//  Elements for background after discussing with client
//  <Card.Img src={clouds} alt="Cloud Background" style={{width:"100%", height:"100%"}}/>
//  <Card.ImgOverlay>
//  </Card.ImgOverlay>
    return (
        <div>
            <Card className="bg-light" style={{left:"0%",width:"100%", height:"100%", borderRadius:"0px"}}>
                    <Card className="welcome">
                        <LanguageList />
                        <h2 id="welcome_msg">{welcome_msg}</h2>
                        <a href="" id="welcome_link" onClick={handleSubmit}>{link_msg}</a>
                    </Card>
            </Card>
        </div>
    );
}