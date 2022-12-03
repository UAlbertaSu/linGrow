import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import clouds from '../Img/clouds.png';
import logo from "../Img/lingrow.png";
import './Activities.css';

export default function Activities() {
    const nav = useNavigate();
    const [header, setHeader] = useState("Language Learning Activities");
    const [activity1, setActivity1] = useState("Kitchen Activities");
    const [activity2, setActivity2] = useState("Bath Activities");
    const [homepage, setHome] = useState("Homepage");

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Language Learning Activities").then(response => setHeader(response));
            Translate('en', lang, "Kitchen Activities").then(response => setActivity1(response));
            Translate('en', lang, "Bath Activities").then(response => setActivity2(response));
            Translate('en', lang, "Homepage").then(response => setHome(response));
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
        <Card className="background_cloud_card">
            <Card.Img src={clouds} alt="Cloud Background" style={{width:"100%", height:"100%",objectFit: "cover"}}/>
            <Card.ImgOverlay>
                <Card style={{height:"80%"}}>
                    <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="responsive image" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                    <LanguageList />
                    <h1>{header}</h1>
                    <Button href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj" id="activity_btn_1" style={{minWidth:"150px"}}>{activity1}</Button>
                    <Button href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ" id="activity_btn_2" style={{minWidth:"150px"}}>{activity2}</Button>
                    <Button variant="secondary" href="dashboard" id="activity_btn_3" style={{minWidth:"150px"}}>{homepage}</Button>
                </Card>
            </Card.ImgOverlay>
        </Card>
    )
}