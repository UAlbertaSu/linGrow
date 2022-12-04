import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import Helmet from 'react-helmet';
import logo from "../Img/lingrow.png";
import './Activities.css';


// a page that displays all the language development activities
// it only redirects to the google page for now, and will redirect to the main activities page at
// https://bilingualacquisition.ca/covid-19-multilingual-families-talking-and-playing/ 

export default function Activities() {
    const nav = useNavigate();
    const [header, setHeader] = useState("Language Learning Activities");
    const [activity1, setActivity1] = useState("Kitchen Activities");
    const [activity2, setActivity2] = useState("Bath Activities");
    const [homepage, setHome] = useState("Homepage");
    const [moreActivities, setMoreActivities] = useState("More Activities");

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Language Learning Activities").then(response => setHeader(response));
            Translate('en', lang, "Kitchen Activities").then(response => setActivity1(response));
            Translate('en', lang, "Bath Activities").then(response => setActivity2(response));
            Translate('en', lang, "More Activities").then(response => setMoreActivities(response));
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

        <Card style={{height:"80%"}}>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>LinGrow Activities</title>
            </Helmet>
            <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="responsive image" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
            <LanguageList />
            <h1>{header}</h1>
            <Button href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj" id="activity_btn_1" style={{minWidth:"150px"}}>{activity1}</Button>
            <Button href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ" id="activity_btn_2" style={{minWidth:"150px"}}>{activity2}</Button>
			<Button href = "https://bilingualacquisition.ca/covid-19-multilingual-families-talking-and-playing/" id = "more_activities" style={{minWidth:"150px"}}>{moreActivities}</Button>
            <Button variant="secondary" href="dashboard" id="activity_btn_3" style={{minWidth:"150px"}}>{homepage}</Button>
        </Card>
    )
}